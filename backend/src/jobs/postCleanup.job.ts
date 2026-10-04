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
      replyTo: null,
    }).distinct("_id");

    if (!expiredPostIds.length) {
      console.log("[POST CLEANUP] No expired posts found.");
      return;
    }
    console.log(
      `[POST CLEANUP] Found ${expiredPostIds.length} expired post(s).`,
    );

    // Replies stored as posts (replyTo -> expired post)
    const replyIds = await Post.find({
      replyTo: { $in: expiredPostIds },
    }).distinct("_id");

    const allPostIds = [...expiredPostIds, ...replyIds];

    const [commentsResult, notificationsResult] = await Promise.all([
      Comment.deleteMany({ post: { $in: allPostIds } }),
      Notification.deleteMany({ post: { $in: allPostIds } }),
    ]);
    console.log(
      `[POST CLEANUP] Deleted ${commentsResult.deletedCount} comment(s) and ${notificationsResult.deletedCount} notification(s).`,
    );

    const postsResult = await Post.deleteMany({ _id: { $in: allPostIds } });
    console.log(
      `[POST CLEANUP] Deleted ${postsResult.deletedCount} post(s) (${expiredPostIds.length} expired + ${replyIds.length} replies).`,
    );
  } catch (error) {
    console.error("[POST CLEANUP ERROR]", error);
  } finally {
    isRunning = false;
    console.log(`[POST CLEANUP] Finished in ${Date.now() - startedAt}ms`);
  }
};

export const startPostCleamupJob = () => {
  // Every 5 minutes
  cron.schedule("*/5 * * * *", runPostCleanup);
  console.log("[POST CLEANUP] Job scheduled: every 5 minutes.");

  // Catch up on anything that expired while the server was down
  runPostCleanup();
};
