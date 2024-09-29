import mongoose, { Schema, model, Document, Types } from "mongoose";

interface IPayment extends Document {
  userId: string;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: String },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
