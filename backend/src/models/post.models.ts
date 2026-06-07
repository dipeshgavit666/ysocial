import type { MediaType } from "express";
import mongoose, {
  Document,
  Schema,
  Types,
  type CallbackWithoutResultAndOptionalError,
} from "mongoose";

export type postVisibility = "public" | "connections" | "private";
export type mediatype = "image" | "video";

export interface IMedia {
  url: string;
  type: MediaType;
  altText?: string;
  width?: number;
  height?: number;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  content: String;
  media: IMedia[];
  visibility: postVisibility;
  replyTo?: Types.ObjectId;

  likeCount: number;
  replyCount: number;
  isEdited: boolean;
  isPinned: boolean;
  hashtags: string[];
  mentions: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    altText: {
      type: String,
    },
    width: Number,
    height: Number,
  },
  { _id: false },
);

const postSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxlength: [3000, "Post content cannot exceed 3000 characters"],
    },
    media: {
      type: [mediaSchema],
      validate: {
        validator: (v: IMedia[]) => v.length <= 4,
        message: "A post can have at most 4 media attachments",
      },
      default: [],
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
  },
  { timestamps: true },
);

//ther is something that will break.
// validate before creating a post- a post must have at least content or media
postSchema.pre("validate", function () {
  if (!this.content && this.media.length === 0) {
    new Error("Post must contain content, media, or a quoted post");
  }
  return;
});

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ replyTo: 1, createdAt: 1 });
postSchema.index({ hashtags: 1, createdAt: -1 });
postSchema.index({ content: "text" });

export const Post = mongoose.model<IPost>("Post", postSchema);
