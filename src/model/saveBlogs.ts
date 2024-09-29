import mongoose, { Schema, model, Document, Types } from "mongoose";

interface IBlogSave extends Document {
  userId: string;
  blogId: string[];
}

const SaveBlogSchema = new Schema<IBlogSave>(
  {
    userId: { type: String },
    blogId: [{ type: String }], 
  },
  { timestamps: true } 
);

export const SaveBlogModel = mongoose.model<IBlogSave>("saveBlog", SaveBlogSchema);
