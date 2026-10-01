import bcrypt from "bcryptjs";
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import jwt, { type Secret } from "jsonwebtoken";
import { ENV } from "../config/env";

export interface IUser extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  bio?: string;
  profileImage?: string;
  website?: string;
  isVerified: boolean;
  isPrivate: boolean;
  posts: Types.ObjectId;
  postCount: number;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: [true, "clerkId is required"],
      unique: true,
    },

    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      lowercase: true,
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be atleast 6 characters"],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    bio: {
      type: String,
      default: "",
      maxlength: [200, "Bio cannot exceed 300 characters"],
    },
    profileImage: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      maxlength: [200, "website length cannot exceed 200 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    posts: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    postCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    ENV.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    ENV.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: ENV.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
    },
  );
};

userSchema.index({ name: "text", bio: "text" });

export const User = mongoose.model<IUser>("User", userSchema);
