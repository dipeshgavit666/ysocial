import { startPostCleanupJob } from "./src/jobs/postCleanup.job.ts";
import app from "./src/app";
import { connectDB } from "./src/config/db";
import { ENV } from "./src/config/env";

connectDB()
  .then(() => {
    startPostCleanupJob();
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on http://localhost:${ENV.PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });
