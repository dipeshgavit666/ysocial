import { getAuth } from "@clerk/express";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { findOrCreateUser } from "../services/user.service";
import type { IUser } from "../models/user.models";

declare global {
  namespace Express {
    interface Request {
      /** The signed-in user's MongoDB document. Set by `protectRoute`. */
      user?: IUser;
    }
  }
}

export const protectRoute = asyncHandler(async (req, _res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new ApiError(401, "Unauthorized - please sign in");
  }

  req.user = await findOrCreateUser(userId);
  next();
});
