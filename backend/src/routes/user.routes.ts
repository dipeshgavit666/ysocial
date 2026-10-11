import { Router } from "express";
import {
  getUserProfile,
  getCurrentUser,
  updateUser,
  followUser,
} from "../controllers/user.controllers";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

// public
router.get("/profile/:username", getUserProfile);

// protected
router.get("/me", protectRoute, getCurrentUser);
router.put("/me", protectRoute, updateUser);
router.post("/:targetUserId/follow", protectRoute, followUser);

export default router;
