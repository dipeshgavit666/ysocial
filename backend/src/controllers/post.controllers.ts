import { Post, type IPost } from "../models/post.models";
import { User } from "../models/user.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import type { QueryFilter } from "mongoose";
import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        [key: string]: any;
      };
    }
  }
}

const createPost = asyncHandler(async (req: Request, res: Response) => {
  const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> =>
    new Promise((resolve, reject) => {
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

  const POST_TTL_MS = 24 * 60 * 60 * 1000;

  const createPost = asyncHandler(async (req: Request, res: Response) => {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) throw new ApiError(401, "Unauthorized");

    const content = String(req.body.content ?? "").trim();
    const imageFile = req.file;

    if (!content && !imageFile) {
      throw new ApiError(400, "Post must contain either content or an image");
    }
    if (content.length > 3000) {
      throw new ApiError(400, "Post content cannot exceed 3000 characters");
    }

    const user = await User.findOne({ clerkId }).select("_id");
    if (!user) throw new ApiError(404, "User not found");

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
      author: user._id,
      content,
      imageUrl,
      expiredAt: new Date(Date.now() + POST_TTL_MS),
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { post }, "Post created successfully"));
  });
});

const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  post.content = req.body.cintent;
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  await post.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post was deleted successfully"));
});

const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter: QueryFilter<IPost> = {
    replyTo: null,
    $or: [{ expiredAt: null }, { expiredAt: { $gt: new Date() } }],
  };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .select("-likes -shares -comments")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username firstName lastName profileImage")
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
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate("user", "username firstName lastName profileImage")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profileImage",
      },
    });

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

  const user = await User.findOne({ username }).select(
    "_id username firstName lastName profileImage",
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const filter: QueryFilter<IPost> = {
    author: user._id,
    replyTo: null,
    $or: [{ expiredAt: null }, { expiredAt: { $gt: new Date() } }],
  };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .select("-likes -shares -comments")
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
  deletePost,
  getSinglePost,
  getUserPosts,
  getPosts,
  updatePost,
};
