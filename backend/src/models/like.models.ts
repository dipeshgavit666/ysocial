import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILike extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

likeSchema.index({ user: 1, post: 1 }, { unique: true });
likeSchema.index({ post: 1, createdAt: -1 });

export const Like = mongoose.model<ILike>("Like", likeSchema);
