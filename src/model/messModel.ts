import mongoose, { Schema, Document } from "mongoose";

export interface MessageDocument extends Document {
  conversationId: string;
  senderId: string;
  message: string;
    createdAt: Date;

}

const MessageSchema: Schema<MessageDocument> = new Schema(
  {
    conversationId: { type: String },
    senderId: { type: String },
    message: { type: String },
    
  },
  { timestamps: true }  
);

export const ChatModel = mongoose.model<MessageDocument>(
  "message",
  MessageSchema
);
