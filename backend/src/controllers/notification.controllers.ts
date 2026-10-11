import type { Request, Response } from "express";
import { Notification } from "../models/notification.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { PUBLIC_USER_FIELDS } from "../utils/constants";

const getNotification = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find({ to: req.user!._id })
    .populate("from", PUBLIC_USER_FIELDS)
    .populate("post", "content imageUrl")
    .populate("comment", "content")
    .sort({ createdAt: -1 })
    .limit(100);

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
  const notification = await Notification.findOneAndDelete({
    _id: req.params.notificationId,
    to: req.user!._id,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Notification deleted successfully"));
});

export { getNotification, deleteNotification };
