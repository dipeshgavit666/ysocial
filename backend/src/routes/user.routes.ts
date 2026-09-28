import { Router } from "express";
import {
  syncUser,
  logoutUser,
  getUserProfile,
  updateUser,
} from "../controllers/user.controllers";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.route("/sync").post(syncUser);
router.route("/logout").post(protectRoute, logoutUser);
router.route("/profile/:username").get(protectRoute, getUserProfile);
router.route("profile").put(protectRoute, updateUser);

export default router;
