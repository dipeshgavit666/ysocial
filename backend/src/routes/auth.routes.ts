import { Router } from "express";
import {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controllers";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/profile").get(verifyJWT, getCurrentUser);

export default router;
