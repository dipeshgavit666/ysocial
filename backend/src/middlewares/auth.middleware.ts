import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { getAuth } from "@clerk/express";

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

export const protectRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { isAuthenticated } = getAuth(req);
    if (!isAuthenticated) {
      throw new ApiError(401, "Unauthorized - you must be logged in");
    }

    next();
  },
);
