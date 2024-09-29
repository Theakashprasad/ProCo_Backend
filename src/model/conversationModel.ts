import mongoose, { Schema, Document, Types } from "mongoose";

export interface ConversationDocument extends Document {
    members: Types.ObjectId[];
    createdAt: Date;

}

const ConversationSchema: Schema<ConversationDocument> = new Schema({
    members: [{ type: Schema.Types.ObjectId }],
},	{ timestamps: true }
);
  
export const CoversationModel = mongoose.model<ConversationDocument>(
  "conversation",
  ConversationSchema
);
