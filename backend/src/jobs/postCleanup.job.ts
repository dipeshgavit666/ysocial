import cron from "node-cron";
import { Post } from "../models/post.models";
import { Like } from "../models/like.models";

export const runPostCleanup = async () => {
  try {
    console.log("[POST CLEANUP] Running cleanup...");

    const expiredPostIds = await Post.find({
      expiredAt: { $lte: new Date() },
      replyTo: null,
    }).distinct("_id");

    if (!expiredPostIds.length) {
      console.log("[POST CLEANUP] No expired posts.");
      return;
    }

    const replyIds = await Post.find({
      replyTo: { $in: expiredPostIds },
    }).distinct("_id");

    const allPostIds = [...expiredPostIds, ...replyIds];

    await Like.deleteMany({ post: { $in: allPostIds } });
    await Post.deleteMany({ _id: { $in: allPostIds } });

    console.log(`[POST CLEANUP] Deleted ${allPostIds.length} posts/replies`);
  } catch (error) {
    console.error("[POST CLEANUP ERROR]", error);
  }
};

export const startPostCleamupJob = () => {
  cron.schedule("0 0 * * *", runPostCleanup);
};
