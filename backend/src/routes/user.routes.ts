import { Router } from "express";
import {
  syncUser,
  getUserProfile,
  updateUser,
  getCurrentUser,
  logoutUser,
  followUser,
} from "../controllers/user.controllers";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

//public route
router.route("/profile/:username").get(protectRoute, getUserProfile);

//protected route
router.route("/sync").post(protectRoute, syncUser);
router.route("/me").get(protectRoute, getCurrentUser);
router.route("/logout").post(protectRoute, logoutUser);
router.route("/profile").put(protectRoute, updateUser);
router.route("/follow/:targetUserId").post(protectRoute, followUser);

export default router;
