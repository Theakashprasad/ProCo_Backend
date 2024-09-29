import mongoose, { Schema, Document } from "mongoose";

export interface Answer {
  userId: string;
  content: string;
}

export interface QuestionDocument extends Document {
  question: string;
  name: string;
  answers: Answer[];
  communityId: string;
}

const QuestionSchema: Schema<QuestionDocument> = new Schema(
  {
    question: { type: String },
    name: { type: String },
    answers: [
      {
        userId: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    communityId: { type: String },
  },
  { timestamps: true }
);

export const QuestionModel = mongoose.model<QuestionDocument>(
  "question",
  QuestionSchema
);
