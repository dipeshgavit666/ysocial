import { Post } from "../models/post.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { Comment } from "../models/comment.model";
import { User } from "../models/user.models";
import { Notification } from "../models/notification.models";

const getNotification = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) throw new ApiError(401, "Unauthorized");

  const user = await User.findOne({ clerkId: userId });
  if (!user) throw new ApiError(404, "User not found");

  const notifications = await Notification.find({ to: req.user!._id })
    .populate("from", "username firstName LastName ProfileImage")
    .populate("post", "content image")
    .populate("comment", "content")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { notifications },
        "Notifications fetched successfully",
      ),
    );
});

const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const { notificationId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    to: user._id,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { notification },
        "Notification deleted successfully",
      ),
    );
});

export { getNotification, deleteNotification };
