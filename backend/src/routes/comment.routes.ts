import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import {
  getComments,
  getReplies,
  createComment,
  deleteComment,
  likeComment,
} from "../controllers/comment.controllers";

const router = Router();

// public
router.route("/post/:postId").get(getComments);
router.route("/:commentId/replies").get(getReplies);

// protected
router.route("/post/:postId").post(protectRoute, createComment);
router.route("/:commentId/like").post(protectRoute, likeComment);
router.route("/:commentId").delete(protectRoute, deleteComment);

export default router;
