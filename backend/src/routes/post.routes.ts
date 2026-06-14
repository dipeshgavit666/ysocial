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

const router = Router();

router.route("/").post(verifyJWT, createPost);
router.route("/").get(getAllPosts);
router.route("/user/:userId").get(getUserPosts);
router.route("/:id").get(getSinglePost);
router.route("/:id").delete(verifyJWT, deletePost);
router.route("/:id").put(verifyJWT, updatePost);

export default router;
