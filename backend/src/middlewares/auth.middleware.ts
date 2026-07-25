import type { Request, Response, NextFunction } from "express";
import type { Types } from "mongoose";
import { asyncHander } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.models";

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

export const verifyJWT = asyncHander(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as JwtPayload;
      const user = await User.findById(decodedToken?.id).select(
        "-password -refreshToken",
      );

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }

      const safeUser = user.toObject({ getters: true }) as unknown as {
        _id: string;
        [key: string]: any;
      };
      safeUser._id = user._id.toString();

      req.user = safeUser;
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid access token");
    }
  },
);
