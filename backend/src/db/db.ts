import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log(`MongoDB connected successfully to ${DB_NAME}`);
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};
