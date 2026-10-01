import { Router } from "express";
import {
  createPost,
  deletePost,
  getSinglePost,
  getUserPosts,
  getAllPosts,
  updatePost,
} from "../controllers/post.controllers";
import { createReply, getReplies } from "../controllers/reply.controllers";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").post(protectRoute, createPost);
router.route("/").get(getAllPosts);
router.route("/user/:userId").get(getUserPosts);
router.route("/:postId").get(getSinglePost);
router.route("/:postId").delete(protectRoute, deletePost);
router.route("/:postId").put(protectRoute, updatePost);

router.route("/:postId").post(protectRoute, createReply);
router.route("/:postId/replies").get(getReplies);

export default router;
