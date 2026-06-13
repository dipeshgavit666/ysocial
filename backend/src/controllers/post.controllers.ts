import { Post } from "../models/post.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHander } from "../utils/async-handler";
import type { Request, Response } from "express";
import mongoose from "mongoose";

const createPost = asyncHander(async (req: Request, res: Response) => {
  const { content } = req.body as {
    content: string;
  };

  if (!content) {
    throw new ApiError(401, "Contents is required");
  }

  const post = await Post.create({
    content,
    author: new mongoose.Types.ObjectId(req.user._id),
  });

  if (!post) {
    throw new ApiError(500, "Something went wrong while creating a post");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { post: post }, "Post created successfully"));
});

const deletePost = asyncHander(async (req: Request, res: Response) => {});

const fetchAllPosts = asyncHander(async (req: Request, res: Response) => {});

const fetchSinglePost = asyncHander(async (req: Request, res: Response) => {});

const fetchUserPosts = asyncHander(async (req: Request, res: Response) => {});
