import cron from "node-cron";
import { Post } from "../models/post.models";
import { Comment } from "../models/comment.model";
import { Notification } from "../models/notification.models";

let isRunning = false;

export const runPostCleanup = async () => {
  // Prevent overlapping runs if a previous cleanup is still going
  if (isRunning) {
    console.log("[POST CLEANUP] Previous run still in progress, skipping.");
    return;
  }
  isRunning = true;

  const startedAt = Date.now();
  console.log(`[POST CLEANUP] Started at ${new Date().toISOString()}`);

  try {
    const expiredPostIds = await Post.find({
      expiredAt: { $lte: new Date() },
    }).distinct("_id");

    if (!expiredPostIds.length) {
      console.log("[POST CLEANUP] No expired posts found.");
      return;
    }
    console.log(
      `[POST CLEANUP] Found ${expiredPostIds.length} expired post(s).`,
    );

    const [commentsResult, notificationsResult] = await Promise.all([
      Comment.deleteMany({ post: { $in: expiredPostIds } }),
      Notification.deleteMany({ post: { $in: expiredPostIds } }),
    ]);
    console.log(
      `[POST CLEANUP] Deleted ${commentsResult.deletedCount} comment(s) and ${notificationsResult.deletedCount} notification(s).`,
    );

    const postsResult = await Post.deleteMany({ _id: { $in: expiredPostIds } });
    console.log(
      `[POST CLEANUP] Deleted ${postsResult.deletedCount} expired post(s).`,
    );
  } catch (error) {
    console.error("[POST CLEANUP ERROR]", error);
  } finally {
    isRunning = false;
    console.log(`[POST CLEANUP] Finished in ${Date.now() - startedAt}ms`);
  }
};

export const startPostCleanupJob = () => {
  // Every 5 minutes
  cron.schedule("*/5 * * * *", runPostCleanup);
  console.log("[POST CLEANUP] Job scheduled: every 5 minutes.");

  // Catch up on anything that expired while the server was down
  runPostCleanup();
};
