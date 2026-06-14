import { Router } from "express";
import {
  createPost,
  deletePost,
  getSinglePost,
  getUserPosts,
  getAllPosts,
  updatePost,
} from "../controllers/post.controllers";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createReply, getReplies } from "../controllers/reply.controllers";
import { toggleLike } from "../controllers/like.controllers";

const router = Router();

router.route("/").post(verifyJWT, createPost);
router.route("/").get(getAllPosts);
router.route("/user/:userId").get(getUserPosts);
router.route("/:postId").get(getSinglePost);
router.route("/:postId").delete(verifyJWT, deletePost);
router.route("/:postId").put(verifyJWT, updatePost);

router.route("/:postId").post(verifyJWT, createReply);
router.route("/:postId/replies").get(getReplies);
router.route("/:postId/like").patch(verifyJWT, toggleLike);

export default router;
