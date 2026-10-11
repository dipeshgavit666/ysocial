import { Post, type IPost } from "../models/post.models";
import { User } from "../models/user.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import {
  POST_TTL_MS,
  PUBLIC_USER_FIELDS,
  notExpired,
} from "../utils/constants";
import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import type { QueryFilter } from "mongoose";
import cloudinary from "../config/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { Notification } from "../models/notification.models";

const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ysocial_posts",
        resource_type: "image",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result)
          return reject(error ?? new Error("Empty upload result"));
        resolve(result);
      },
    );
    uploadStream.end(buffer); // no need for PassThrough or require("stream")
  });
};

const createPost = asyncHandler(async (req: Request, res: Response) => {
  const content = String(req.body.content ?? "").trim();
  const imageFile = req.file;

  if (!content && !imageFile) {
    throw new ApiError(400, "Post must contain either content or an image");
  }
  if (content.length > 3000) {
    throw new ApiError(400, "Post content cannot exceed 3000 characters");
  }

  const user = req.user!;

  let imageUrl: string | undefined;
  if (imageFile) {
    try {
      const result = await uploadToCloudinary(imageFile.buffer);
      imageUrl = result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error", error);
      throw new ApiError(500, "Failed to upload image");
    }
  }

  const post = await Post.create({
    user: user._id,
    content,
    imageUrl,
    expiredAt: new Date(Date.now() + POST_TTL_MS),
  });

  await post.populate("user", PUBLIC_USER_FIELDS);

  return res
    .status(201)
    .json(new ApiResponse(201, { post }, "Post created successfully"));
});

const likePost = asyncHandler(async (req: Request, res: Response) => {
  const postId = String(req.params.postId);
  if (!isValidObjectId(postId)) throw new ApiError(400, "Invalid post ID");

  const user = req.user!;

  // Try to like: only matches if the user hasn't liked yet
  const likedPost = await Post.findOneAndUpdate(
    { _id: postId, likes: { $ne: user._id } },
    { $addToSet: { likes: user._id }, $inc: { likeCount: 1 } },
    { returnDocument: "after" },
  ).select("user likeCount");

  if (likedPost) {
    if (likedPost.user.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: likedPost.user,
        type: "post_like",
        post: postId,
      });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { liked: true, likeCount: likedPost.likeCount },
          "Post liked successfully",
        ),
      );
  }

  // Otherwise try to unlike: only matches if the user has liked
  const unlikedPost = await Post.findOneAndUpdate(
    { _id: postId, likes: user._id },
    { $pull: { likes: user._id }, $inc: { likeCount: -1 } },
    { returnDocument: "after" },
  ).select("likeCount");

  if (!unlikedPost) throw new ApiError(404, "Post not found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { liked: false, likeCount: unlikedPost.likeCount },
        "Post unliked successfully",
      ),
    );
});

const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const postId = String(req.params.postId);
  if (!isValidObjectId(postId)) throw new ApiError(400, "Invalid post ID");

  const content = String(req.body.content ?? "").trim();
  if (content.length > 3000) {
    throw new ApiError(400, "Post content cannot exceed 3000 characters");
  }

  const user = req.user!;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  if (post.user.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not allowed to edit this post");
  }

  // A post must keep either text or an image
  if (!content && !post.imageUrl) {
    throw new ApiError(400, "Post must contain either content or an image");
  }

  post.content = content;
  post.isEdited = true;
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const postId = String(req.params.postId);
  if (!isValidObjectId(postId)) throw new ApiError(400, "Invalid post ID");

  const user = req.user!;

  const post = await Post.findById(postId).select("user");
  if (!post) throw new ApiError(404, "Post not found");

  if (post.user.toString() !== user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this post");
  }

  await post.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter: QueryFilter<IPost> = notExpired();

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .select("-likes -shares")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", PUBLIC_USER_FIELDS)
      .lean(),
    Post.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        page,
        limit,
        total,
        hasMore: skip + posts.length < total,
      },
      "Posts fetched successfully",
    ),
  );
});

const getSinglePost = asyncHandler(async (req: Request, res: Response) => {
  const postId = String(req.params.postId);
  if (!isValidObjectId(postId)) throw new ApiError(400, "Invalid post ID");

  const post = await Post.findOne({ _id: postId, ...notExpired() })
    .select("-likes -shares")
    .populate("user", PUBLIC_USER_FIELDS);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Post fetched successfully"));
});

const getUserPosts = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;

  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const user = await User.findOne({
    username: String(username).toLowerCase(),
  }).select("_id username firstName lastName profileImage");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const filter: QueryFilter<IPost> = {
    user: user._id,
    ...notExpired(),
  };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .select("-likes -shares")
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
        posts,
        page,
        limit,
        total,
        hasMore: skip + posts.length < total,
      },
      "User posts fetched successfully",
    ),
  );
});

export {
  createPost,
  likePost,
  deletePost,
  getSinglePost,
  getUserPosts,
  getPosts,
  updatePost,
};
