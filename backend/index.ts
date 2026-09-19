import app from "./src/app";
import { connectDB } from "./src/config/db.ts";
import { startPostCleamupJob } from "./src/jobs/postCleanup.job.ts";
import { clerkMiddleware } from "@clerk/express";

const port = process.env.PORT || 3000;

app.use(clerkMiddleware());

connectDB()
  .then(() => {
    startPostCleamupJob();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("mongodb connection failed:", error);
  });
