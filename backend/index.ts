import app from "./src/app";
import { connectDB } from "./src/config/db.ts";
import { ENV } from "./src/config/env.ts";
import { startPostCleamupJob } from "./src/jobs/postCleanup.job.ts";
import { clerkMiddleware, clerkClient, getAuth } from "@clerk/express";

const port = ENV.PORT;

app.use(clerkMiddleware());

app.get("/protected", async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    res.status(401).json({ error: "Unuserized" });
    return;
  }

  // Use the `getUser()` method to get the user's User object
  const user = await clerkClient.users.getUser(userId);

  res.json({ user });
});

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
