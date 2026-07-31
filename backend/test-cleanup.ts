import { connectDB } from "./src/db/db";
import { runPostCleanup } from "./src/jobs/postCleanup.job";
import mongoose from "mongoose";

await connectDB();
await runPostCleanup();
await mongoose.disconnect();
