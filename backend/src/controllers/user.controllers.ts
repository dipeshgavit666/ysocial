import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.models";
import { Notification } from "../models/notification.models";
import { updateProfileSchema } from "../schema/user.schema";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

// Never expose these on public profiles.
const PRIVATE_FIELDS = "-clerkId -email";

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const username = String(req.params.username).toLowerCase();
  const user = await User.findOne({ username }).select(PRIVATE_FIELDS);
  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, { user }, "User found"));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "Current user fetched"));
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(
      400,
      parsed.error.issues[0]?.message ?? "Invalid input",
      parsed.error.issues,
    );
  }

  const user = await User.findByIdAndUpdate(req.user!._id, parsed.data, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Profile updated successfully"));
});

const followUser = asyncHandler(async (req: Request, res: Response) => {
  const targetUserId = String(req.params.targetUserId);
  if (!isValidObjectId(targetUserId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const me = req.user!;
  if (me._id.equals(targetUserId)) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const target = await User.findById(targetUserId).select("_id");
  if (!target) throw new ApiError(404, "User not found");

  const isFollowing = me.following.some((id) => id.equals(target._id));

  if (isFollowing) {
    await Promise.all([
      User.updateOne({ _id: me._id }, { $pull: { following: target._id } }),
      User.updateOne({ _id: target._id }, { $pull: { followers: me._id } }),
    ]);
  } else {
    await Promise.all([
      User.updateOne({ _id: me._id }, { $addToSet: { following: target._id } }),
      User.updateOne({ _id: target._id }, { $addToSet: { followers: me._id } }),
      Notification.create({
        from: me._id,
        to: target._id,
        type: "follow_request",
      }),
    ]);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { following: !isFollowing },
        isFollowing ? "Unfollowed user" : "Followed user",
      ),
    );
});

export { getUserProfile, getCurrentUser, updateUser, followUser };
