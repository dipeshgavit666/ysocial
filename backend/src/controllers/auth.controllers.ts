import { User } from "../models/user.models";
import { ApiResponse } from "../utils/api-response";
import { asyncHander } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { registerUserSchema } from "../schema/auth.schema";
import { loginUserSchema } from "../schema/auth.schema";

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

const generateAccessTokenAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = (user as any).generateAccessToken();
    const refreshToken = (user as any).generateRefreshToken();

    (user as any).refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating accessToken and refreshToken",
    );
  }
};

const registerUser = asyncHander(async (req, res) => {
  const result = registerUserSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      "Invalid registration input data",
      result.error.issues,
    );
  }

  const { name, username, email, password } = result.data;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with this username or email already exists",
      [],
    );
  }

  const user = await User.create({
    name,
    email,
    username,
    password,
  });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id.toString());

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
      | "none"
      | "lax",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: createdUser, accessToken, refreshToken },
        "user registered successfully",
      ),
    );
});

const login = asyncHander(async (req, res) => {
  const result = loginUserSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, "Invalid login data", result.error.issues);
  }

  const { email, password } = result.data;

  const user = (await User.findOne({
    email,
  }).select("+password")) as any;

  if (!user) {
    throw new ApiError(400, "invalid Email or password");
  }

  const isPasswordCorrect: boolean = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id.toString());

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
      | "none"
      | "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully",
      ),
    );
});

const logoutUser = asyncHander(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(
    req.user!._id,
    { $set: { refreshToken: "" } },
    { new: true },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
      | "none"
      | "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getCurrentUser = asyncHander(async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const refreshAccessToken = asyncHander(async (req: Request, res: Response) => {
  const incommingRefreshToken: string | undefined =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as JwtPayload;

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Refresh token is expired");
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
        | "none"
        | "lax",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id.toString());

    (user as any).refreshToken = newRefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh Token");
  }
});

export { registerUser, login, logoutUser, getCurrentUser, refreshAccessToken };
