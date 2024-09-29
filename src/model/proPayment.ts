import mongoose, { Schema, Document } from "mongoose";

export interface UserId {
  userId: string;
  date: string;
}

export interface PaymentDocument extends Document {
  proId: string;
  name: string;
  users: UserId[];
  status: boolean;
  amount: number;
}

const PaymentSchema: Schema<PaymentDocument> = new Schema(
  {
    proId: { type: String },
    name: { type: String },
    users: [
        {
          userId: { type: String},
          date: { type: String},
        },
      ],
    amount: { type: Number },
    status: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const PaymentProModel = mongoose.model<PaymentDocument>(
  "proPayment",
  PaymentSchema
);
