import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants";
import { ENV } from "../config/env";

export const connectDB = async () => {
  try {
    if (ENV.NODE_ENV == "development") {
      await mongoose.connect("mongodb://localhost:27017/ysocial");
    } else {
      await mongoose.connect(`${ENV.MONGO_URI}/${DB_NAME}`);
      console.log(`MongoDB connected successfully to ${DB_NAME}`);
    }
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};
