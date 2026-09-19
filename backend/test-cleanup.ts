import { connectDB } from "./src/config/db";
import { runPostCleanup } from "./src/jobs/postCleanup.job";
import mongoose from "mongoose";

await connectDB();
await runPostCleanup();
await mongoose.disconnect();
