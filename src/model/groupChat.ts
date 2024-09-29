import mongoose, { Schema, Document, Types } from "mongoose";

interface Member {
  userId: Types.ObjectId;
  status: string; 
}

export interface ConversationGroupDocument extends Document {
  name: string;
  creator: string;
  // members: Types.ObjectId[];
  members: Member[];
  profilePic: string;
}

const ConversationGroupSchema: Schema<ConversationGroupDocument> = new Schema(
  {
    name: String,
    creator: String,
    // members: [{ type: Schema.Types.ObjectId }],
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'user' },
        status: { type: String, default: 'active' } // Example status, adjust as needed
      }
    ],
    profilePic: {type: String, default: "",},
  },
  { timestamps: true }
);

export const CoversationGroupModel = mongoose.model<ConversationGroupDocument>(
  "conversationGroup",
  ConversationGroupSchema
);
