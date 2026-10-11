import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./config/env";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import healthCheckRouter from "./routes/healthcheck.routes";
import postRouter from "./routes/post.routes";
import commentRouter from "./routes/comment.routes";
import userRouter from "./routes/user.routes";
import notificationRouter from "./routes/notification.routes";

const app = express();

app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

const authorizedParties = Array.isArray(ENV.CORS_ORIGIN)
  ? ENV.CORS_ORIGIN.flat()
  : ENV.CORS_ORIGIN
    ? [ENV.CORS_ORIGIN]
    : undefined;

app.use(
  clerkMiddleware({
    authorizedParties,
  }),
);

app.get("/", (_req, res) => {
  res.send("Welcome to Y Social");
});

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notifications", notificationRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
