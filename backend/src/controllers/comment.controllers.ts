import { Post } from "../models/post.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { Comment } from "../models/comment.model";
import { User } from "../models/user.models";
import { Notification } from "../models/notification.models";

const createComment = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) throw new ApiError(401, "Unauthorized");
  const { postId } = req.params;
  const { content } = req.body;

  const user = User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.create({
    user: req.user!._id,
    content: req.body.content,
    post: new (require("mongoose").Types.ObjectId)(postId),
  });

  await Post.findByIdAndUpdate(postId, {
    $push: { comments: content._id },
    $inc: {
      commentCount: 1,
    },
  });

  // notification for comment
  if (post.user.toString() !== req.user!._id.toString()) {
    await Notification.create({
      from: req.user!._id,
      to: post.user,
      type: "post_comment",
      post: new (require("mongoose").Types.ObjectId)(postId),
      comment: comment._id,
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { comment }, "Reply created successfully"));
});

const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profileImage");

  if (!comments) {
    throw new ApiError(500, "Failed to fetch comments");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        count: comments.length,
      },
      "comments fetched successfully",
    ),
  );
});

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const { commentId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const comment = await Comment.findById(commentId);

  if (!user || !comment) {
    throw new ApiError(404, "user or comment not found");
  }

  if (comment.user.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: commentId },
  });

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully"));
});

export { createComment, getComments, deleteComment };
