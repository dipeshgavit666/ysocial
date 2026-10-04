import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPost extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  imageUrl?: string;
  likes: Types.ObjectId[];
  likeCount: number;
  commentCount: number;
  shares: Types.ObjectId[];
  shareCount: number;
  isEdited: boolean;
  isPinned: boolean;
  hashtags: string[];
  mentions: Types.ObjectId[];
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [3000, "Post content cannot exceed 3000 characters"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shares: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    hashtags: {
      type: [String],
      default: [],
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiredAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

postSchema.index({ expiredAt: 1 });
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ hashtags: 1, createdAt: -1 });
postSchema.index({ content: "text" });

export const Post = mongoose.model<IPost>("Post", postSchema);
