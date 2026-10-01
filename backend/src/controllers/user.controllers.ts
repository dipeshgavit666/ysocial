import { User } from "../models/user.models";
import { ApiResponse } from "../utils/api-response";
import { asyncHander } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import type { Request, Response } from "express";
import { clerkClient, getAuth } from "@clerk/express";

const syncUser = asyncHander(async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new ApiError(401, "something went wrong");
  }

  const existingUser = await User.findOne({ clerkId: userId });

  if (existingUser) {
    throw new ApiError(409, "User already exists", []);
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new ApiError(400, "Clerk user has no email address", []);
  }

  const userData = {
    clerkId: userId,
    email,
    firstName: clerkUser.firstName ?? "",
    lastName: clerkUser.lastName ?? "",
    username: email.split("@")[0],
    getUserProfile: clerkUser.imageUrl ?? "",
  };

  const user = await User.create(userData);

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "user registered successfully"));
});

const getUserProfile = asyncHander(async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  return res.status(200).json(new ApiResponse(200, { user }, "user found"));
});

const updateUser = asyncHander(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const user = await User.findByIdAndUpdate({ clerkId: userId }, req.body, {
    new: true,
  });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "user profile updated successfully"));
});

const getCurrentUser = asyncHander(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const user = await User.findById({ clerkId: userId });
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "fetched current user succesfully"));
});

const followUser = asyncHander(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new ApiError(401, "Unauthenticated");
  }

  const targetUserId = req.params.userId as string | undefined;
  if (!targetUserId) {
    throw new ApiError(400, "Missing target user id");
  }

  if (userId === targetUserId) {
    throw new ApiError(400, "you cannot follow yourself");
  }
});
const logoutUser = asyncHander(async (req: Request, res: Response) => {});

//delete all user data
const deleteUser = asyncHander(async (req: Request, res: Response) => {});

export {
  syncUser,
  getUserProfile,
  updateUser,
  getCurrentUser,
  logoutUser,
  followUser,
};
