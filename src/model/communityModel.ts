import mongoose, { Schema, Document, Types } from "mongoose";

interface Member {
  userId: string;
  status: string; 
}

export interface CommunityDocument extends Document {
  name: string;
  creator: string;
  members: Member[];
  profilePic: string;
  groupCode: string;
}
 
const CommunitySchema: Schema<CommunityDocument> = new Schema(
  {
    name: String,
    creator: String,
    // members: [{ type: Schema.Types.ObjectId }],
    members: [
      {
        userId: { type: String },
        status: { type: String, default: 'pending' } // Example status, adjust as needed
      }
    ],
    profilePic: {type: String, default: "",},
    groupCode: {type:String, default: null},

  },
  { timestamps: true }
);

export const CommunityModel = mongoose.model<CommunityDocument>(
  "community",
  CommunitySchema
);
