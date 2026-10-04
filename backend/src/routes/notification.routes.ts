import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import {
  getNotification,
  deleteNotification,
} from "../controllers/notification.controllers";

const router = Router();

router.route("/").get(protectRoute, getNotification);
router.route("/:notificationId").delete(protectRoute, deleteNotification);

export default router;
