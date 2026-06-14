import { Router } from "express";
import {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controllers";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(logoutUser);
router.route("/profile").get(getCurrentUser);

export default router;
