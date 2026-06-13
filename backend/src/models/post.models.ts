import mongoose, { Document, Schema, Types } from "mongoose";

export type postVisibility = "public" | "connections" | "private";

export interface IPost extends Document {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  content: String;
  visibility: postVisibility;
  replyTo?: Types.ObjectId;

  likeCount: number;
  replyCount: number;
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
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: [3000, "Post content cannot exceed 3000 characters"],
    },
    visibility: {
      type: String,
      emun: ["public", "connections", "private"] satisfies postVisibility[],
      default: "public",
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    replyCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isEdited: {
      type: Boolean,
      defaulr: false,
    },
    isPinned: {
      type: Boolean,
      defalt: false,
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

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ replyTo: 1, createdAt: 1 });
postSchema.index({ hashtags: 1, createdAt: -1 });
postSchema.index({ content: "text" });

export const Post = mongoose.model<IPost>("Post", postSchema);
