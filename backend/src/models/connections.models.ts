import mongoose, { Document, Schema, Types } from "mongoose";

export type ConnectionStatus =
  | "accespted"
  | "rejected"
  | "pending"
  | "withdrawn";

export interface IConnections extends Document {
  _id: Types.ObjectId;
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  status: ConnectionStatus;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const connectionsSchema = new Schema<IConnections>(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: [
        "accespted",
        "rejected",
        "pending",
        "withdrawn",
      ] satisfies ConnectionStatus[],
      default: "pending",
    },
    message: {
      type: String,
      maxlength: [300, "Connection message cannot exceed 300 characters"],
    },
  },
  { timestamps: true },
);

connectionsSchema.index({ requester: 1, recipient: 1 }, { unique: true });
connectionsSchema.index({ requester: 1 });
connectionsSchema.index({ recipient: 1 });

export const Connections = mongoose.model<IConnections>(
  "Connections",
  connectionsSchema,
);
