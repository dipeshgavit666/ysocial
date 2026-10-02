import { Router } from "express";
import {
  createPost,
  likePost,
  deletePost,
  getSinglePost,
  getUserPosts,
  getPosts,
  updatePost,
} from "../controllers/post.controllers";
import { createReply, getReplies } from "../controllers/reply.controllers";
import { protectRoute } from "../middlewares/auth.middleware";
import upload from "../middlewares/uplaod.middleware";

const router = Router();

// public route

router.route("/").get(getPosts);
router.route("/:postId").get(getSinglePost);
router.route("/user/:username").get(getUserPosts);

// protected route
router.route("/").post(protectRoute, upload.single("image"), createPost);
router.route("/").post(protectRoute, likePost);
router.route("/:postId").delete(protectRoute, deletePost);
router.route("/:postId").put(protectRoute, updatePost);

router.route("/:postId").post(protectRoute, createReply);
router.route("/:postId/replies").get(getReplies);

export default router;
