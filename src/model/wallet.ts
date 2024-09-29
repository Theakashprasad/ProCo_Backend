import mongoose, { Schema, Document } from "mongoose";

export interface WalletDocument extends Document {
  proId: string;
  numberOfUsers: number;
  amount: number;
}

const WalletSchema: Schema<WalletDocument> = new Schema(
  {
    proId: { type: String },
    numberOfUsers: { type: Number },
    amount: { type: Number, default: 0 },   
     },
  { timestamps: true }
);

export const WalletModel = mongoose.model<WalletDocument>(
  "wallet",
  WalletSchema
);
