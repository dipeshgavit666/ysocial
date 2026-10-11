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
import { protectRoute } from "../middlewares/auth.middleware";
import upload from "../middlewares/uplaod.middleware";

const router = Router();

// public
router.get("/", getPosts);
router.get("/user/:username", getUserPosts);
router.get("/:postId", getSinglePost);

// protected
router.post("/", protectRoute, upload.single("image"), createPost);
router.patch("/:postId/like", protectRoute, likePost);
router.put("/:postId", protectRoute, updatePost);
router.delete("/:postId", protectRoute, deletePost);

export default router;
