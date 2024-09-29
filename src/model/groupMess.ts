import mongoose, { Schema, Document } from "mongoose";

export interface GroupMessageDocument extends Document {
  conversationId: string;
  senderId: string;
  message: string;
  fullName: string
}

const GroupMessageSchema: Schema<GroupMessageDocument> = new Schema(
  {
    conversationId: { type: String },
    senderId: { type: String },
    message: { type: String },
    fullName: { type: String },
  },
  { timestamps: true }
);

export const GroupChatModel = mongoose.model<GroupMessageDocument>(
  "GroupMessage",
  GroupMessageSchema
);
