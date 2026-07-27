import { Post } from "../models/post.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHander } from "../utils/async-handler";
import type { Request, Response } from "express";
import mongoose from "mongoose";

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

const createPost = asyncHander(async (req: Request, res: Response) => {
  const { content } = req.body as {
    content: string;
  };

  if (!content) {
    throw new ApiError(401, "Contents is required");
  }

  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const post = await Post.create({
    content,
    author: new mongoose.Types.ObjectId(req.user!._id),
    expiredAt,
  });

  if (!post) {
    throw new ApiError(500, "Something went wrong while creating a post");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { post: post }, "Post created successfully"));
});

const updatePost = asyncHander(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user?.id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  post.content = req.body.cintent;
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { post }, "Post updated successfully"));
});

const deletePost = asyncHander(async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.author.toString() !== req.user?.id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  await post.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post was deleted successfully"));
});

const getAllPosts = asyncHander(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 500);

  const skip = (page - 1) * limit;

  const posts = await Post.find({
    visibility: "public",
    replyTo: null,
  })
    .populate("author", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        page,
        limit,
        posts,
      },
      "Post fetched successfully",
    ),
  );
});

const getSinglePost = asyncHander(async (req: Request, res: Response) => {
  const singlePost = await Post.findById(req.params.id).populate(
    "author",
    "username",
  );

  if (!singlePost) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { singlePost }, "Post fetched successfully"));
});

const getUserPosts = asyncHander(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const userPosts = await Post.find({
    author: userId,
  })
    .populate("author", "username")
    .sort({ createdAt: -1 });

  if (!userPosts) {
    throw new ApiError(500, "Failed to fetch posts");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { userPosts }, "Posts fetched successfully"));
});

export {
  createPost,
  deletePost,
  getSinglePost,
  getUserPosts,
  getAllPosts,
  updatePost,
};
