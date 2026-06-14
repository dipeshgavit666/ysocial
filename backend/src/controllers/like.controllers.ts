import { Like } from "../models/like.models";
import { Post } from "../models/post.models";
import { User } from "../models/user.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHander } from "../utils/async-handler";
import type { Request, Response } from "express";
import mongoose from "mongoose";

const toggleLike = asyncHander(async (req: Request, res: Response) => {
  try {
    const postId = req.params.id as string;
    const userId = req.user?._id as string;

    const existingLike = await Like.findOne({
      user: userId,
      post: postId,
    });

    if (!existingLike) {
      await Like.create({
        user: userId,
        post: postId,
      });

      await Post.findByIdAndUpdate(postId, {
        $inc: {
          likeCount: 1,
        },
      });

      return res
        .status(200)
        .json(new ApiResponse(200, { existingLike }, "liked this post"));
    } else {
      await Like.findByIdAndDelete(existingLike._id);

      await Post.findByIdAndUpdate(postId, {
        $inc: {
          likeCount: -1,
        },
      });

      return res
        .status(200)
        .json(
          new ApiResponse(200, { existingLike }, "like removed from this post"),
        );
    }
  } catch (error) {
    throw new ApiError(500, "Failed to toggle like");
  }
});

export { toggleLike };
