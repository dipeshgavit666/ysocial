import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import postRouter from "./routes/post.routes.ts";
import authRouter from "./routes/auth.routes.ts";

app.use("/api/v1/healthcheck", healthCheckRouter);

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Y Social");
});

export default app;
