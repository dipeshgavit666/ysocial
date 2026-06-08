import mongoose, { Document, Schema, Types } from "mongoose";

export type NotificationType =
  | "conection_request"
  | "connection_accepted"
  | "post_like"
  | "post_reply"
  | "mention";

export interface INotification extends Document {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  actor: Types.ObjectId;
  type: NotificationType;
  post?: Types.ObjectId; //relavent post
  connections: Types.ObjectId; //relavent  connections
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "conection_request",
        "connection_accepted",
        "post_like",
        "post_reply",
        "mention",
      ] satisfies NotificationType[],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    connections: {
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
