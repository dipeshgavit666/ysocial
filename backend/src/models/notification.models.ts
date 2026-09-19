import mongoose, { Document, Schema, Types } from "mongoose";

export type NotificationType =
  | "follow_request"
  | "follow_accept"
  | "post_like"
  | "post_comment"
  | "mention";

export interface INotification extends Document {
  _id: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  type: NotificationType;
  post?: Types.ObjectId; //relavent post
  comment?: Types.ObjectId; //relavent comment
  follower: Types.ObjectId; //relavent  follower
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "follow_request",
        "follow_accept",
        "post_like",
        "post_comment",
        "mention",
      ] satisfies NotificationType[],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "Connections",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
