import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://locahost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Conent-Type", "Authorization"],
  }),
);

// import routes
// import healthCheckRouter from "./routes/healthcheck.routes.js";

// app.use("/api/v1/healthcheck", healthChechRouter)

app.get("/", (req, res) => {
  res.send("Welcome to Y Social");
});

export default app;
