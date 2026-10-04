import { Post } from "../models/post.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { getAuth } from "@clerk/express";
import { Comment } from "../models/comment.model";
import { User } from "../models/user.models";
import { Notification } from "../models/notification.models";

const USER_FIELDS = "username firstName lastName profileImage";

const notExpired = () => ({
  $or: [{ expiredAt: null }, { expiredAt: { $gt: new Date() } }],
});

const createComment = asyncHandler(async (req: Request, res: Response) => {
  const { userId: clerkId } = getAuth(req);
  if (!clerkId) throw new ApiError(401, "Unauthorized");

  const postId = String(req.params.postId);
  if (!isValidObjectId(postId)) throw new ApiError(400, "Invalid post ID");

  const content = String(req.body.content ?? "").trim();
  if (!content) throw new ApiError(400, "Content is required");
  if (content.length > 500) {
    throw new ApiError(400, "Comment cannot exceed 500 characters");
  }

  const user = await User.findOne({ clerkId }).select("_id");
  if (!user) throw new ApiError(404, "User not found");

  const post = await Post.findOne({ _id: postId, ...notExpired() }).select(
    "user",
  );
  if (!post) throw new ApiError(404, "Post not found");

  // replying to an existing comment
  let parentId: string | null = null;
  if (req.body.parentComment) {
    if (!isValidObjectId(req.body.parentComment)) {
      throw new ApiError(400, "Invalid parent comment ID");
    }
    const parent = await Comment.findOne({
      _id: req.body.parentComment,
      post: postId,
    });
    if (!parent) throw new ApiError(404, "Parent comment not found");

    // replies to a reply attach to the top level comment
    parentId = String(parent.parentComment ?? parent._id);
  }

  const comment = await Comment.create({
    post: postId,
    user: user._id,
    content,
    parentComment: parentId,
  });

  await Promise.all([
    Post.updateOne({ _id: postId }, { $inc: { commentCount: 1 } }),
    parentId
      ? Comment.updateOne({ _id: parentId }, { $inc: { replyCount: 1 } })
      : null,
  ]);

  // notification for comment
  if (post.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "post_comment",
      post: postId,
      comment: comment._id,
    });
  }

  await comment.populate("user", USER_FIELDS);

  return res
    .status(201)
    .json(new ApiResponse(201, { comment }, "Comment created successfully"));
});

const getComments = asyncHandler(async (req: Request, res: Response) => {
  const postId = String(req.params.postId);
  if (!isValidObjectId(postId)) throw new ApiError(400, "Invalid post ID");

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter = { post: postId, parentComment: null };

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .select("-likes")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", USER_FIELDS)
      .lean(),
    Comment.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        count: comments.length,
        page,
        limit,
        total,
        hasMore: skip + comments.length < total,
      },
      "Comments fetched successfully",
    ),
  );
});

const getReplies = asyncHandler(async (req: Request, res: Response) => {
  const commentId = String(req.params.commentId);
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter = { parentComment: commentId };

  const [replies, total] = await Promise.all([
    Comment.find(filter)
      .select("-likes")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate("user", USER_FIELDS)
      .lean(),
    Comment.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        replies,
        page,
        limit,
        total,
        hasMore: skip + replies.length < total,
      },
      "Replies fetched successfully",
    ),
  );
});

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { userId: clerkId } = getAuth(req);
  if (!clerkId) throw new ApiError(401, "Unauthorized");

  const commentId = String(req.params.commentId);
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const user = await User.findOne({ clerkId }).select("_id");
  if (!user) throw new ApiError(404, "User not found");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  const post = await Post.findById(comment.post).select("user");
  const isAuthor = comment.user.toString() === user._id.toString();
  const isPostOwner = post?.user.toString() === user._id.toString();
  if (!isAuthor && !isPostOwner) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  let removed = 1;
  if (!comment.parentComment) {
    // Deleting a top-level comment also deletes its replies
    const replies = await Comment.deleteMany({ parentComment: comment._id });
    removed += replies.deletedCount;
  } else {
    await Comment.updateOne(
      { _id: comment.parentComment },
      { $inc: { replyCount: -1 } },
    );
  }

  await comment.deleteOne();
  await Post.updateOne(
    { _id: comment.post },
    { $inc: { commentCount: -removed } },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

const likeComment = asyncHandler(async (req: Request, res: Response) => {
  const { userId: clerkId } = getAuth(req);
  if (!clerkId) throw new ApiError(401, "Unauthorized");

  const commentId = String(req.params.commentId);
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const user = await User.findOne({ clerkId }).select("_id");
  if (!user) throw new ApiError(404, "User not found");

  const liked = await Comment.findOneAndUpdate(
    { _id: commentId, likes: { $ne: user._id } },
    { $addToSet: { likes: user._id }, $inc: { likeCount: 1 } },
    { new: true },
  ).select("likeCount");

  if (liked) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { liked: true, likeCount: liked.likeCount },
          "Comment liked successfully",
        ),
      );
  }

  const unliked = await Comment.findOneAndUpdate(
    { _id: commentId, likes: user._id },
    { $pull: { likes: user._id }, $inc: { likeCount: -1 } },
    { new: true },
  ).select("likeCount");

  if (!unliked) throw new ApiError(404, "Comment not found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { liked: false, likeCount: unliked.likeCount },
        "Comment unliked successfully",
      ),
    );
});

export { createComment, getComments, getReplies, deleteComment, likeComment };
