import mongoose, { Document, Schema, Types } from "mongoose";

export interface IComment extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  likes: Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 200,
    },
    likes: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

commentSchema.index({ user: 1, post: 1 }, { unique: true });
commentSchema.index({ post: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
