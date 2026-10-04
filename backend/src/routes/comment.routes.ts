import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/comment.controllers";

const router = Router();

router.route("/post/:postId").get(getComments);

//protected routes
router.route("/post/:postId").post(protectRoute, createComment);
router.route("/:commentId").delete(protectRoute, deleteComment);

export default router;
