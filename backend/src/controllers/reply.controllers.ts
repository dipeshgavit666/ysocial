import { Post } from "../models/post.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHander } from "../utils/async-handler";
import type { Request, Response } from "express";

const createReply = asyncHander(async (req: Request, res: Response) => {
  const replyTo = await Post.findById(req.params.postId);

  if (!replyTo) {
    throw new ApiError(404, "Post not found");
  }

  if (!req.body.content) {
    throw new ApiError(400, "Content is required");
  }

  const reply = await Post.create({
    author: req.user!._id,
    content: req.body.content,
    replyTo: replyTo._id,
  });

  await Post.findByIdAndUpdate(replyTo._id, {
    $inc: {
      replyCount: 1,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, reply, "Reply created successfully"));
});

const getReplies = asyncHander(async (req: Request, res: Response) => {
  const replies = await Post.find({
    replyTo: req.params.postId,
  })
    .populate("author", "username")
    .sort({
      createdAt: -1,
    });

  if (!replies) {
    throw new ApiError(500, "Failed to fetch replies");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        replies,
        count: replies.length,
      },
      "Replies fetched successfully",
    ),
  );
});

export { createReply, getReplies };
