import { Admin } from "../entities/user";
import { UserModel } from "../model/userModel";
import dotenv from "dotenv";
import { AdminModel } from "../model/adminModel";
import { IAdminrRepository } from "../providers/interface/admin/IAdminRepository";
import { Payment } from "../entities/payment";
import { PaymentModel } from "../model/payment";
import { PaymentProModel } from "../model/proPayment";
import { ProPayment } from "../entities/proPayment";
import { Wallet } from "../entities/wallet";
import { WalletModel } from "../model/wallet";
import { BlogModel } from "../model/blogModel";
import { Blog } from "../entities/blog";

dotenv.config();

export class AdminRepository implements IAdminrRepository {
  adminLogin = async (
    email: string,
    password: string
  ): Promise<Admin | null> => {
    try {
      return await AdminModel.findOne({ email });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  getPayment = async (): Promise<Payment[] | null> => {
    try {
      const data = await PaymentModel.find();
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  getProPayment = async (): Promise<ProPayment[] | null> => {
    try {
      const data = await PaymentProModel.find()
        .populate({
          path: "users.userId", // Path to populate
          model: UserModel, // Use the model name as a string
          select: "fullname", // Specify which fields to include from the User model
        })
        .exec(); // Execute the query
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  addWallet = async (
    proId: string,
    numberOfUsers: number,
    amount: number
  ): Promise<Wallet | null> => {
    const data = {
      proId,
      numberOfUsers,
      amount,
    };
    try {
      const result = await WalletModel.create(data);
      return result;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  proPayStatus = async (proId: string): Promise<ProPayment | null> => {
    let result = null;
    try {
      const falseStatusPayment = await PaymentProModel.findOne({
        proId,
        status: false,
      });
      if (falseStatusPayment) {
        falseStatusPayment.status = true;
        result = await falseStatusPayment.save();
      }
      return result;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  
  blogVerify = async (
    userId: string,
    isBlocked: boolean
  ): Promise<Blog | null> => {
    try {
      return await BlogModel.findOneAndUpdate(
        { _id: userId },
        { $set: { block: isBlocked } },
        { new: true }
      );
    } catch (error) {
      console.log("error", error);

      throw error;
    }
  };

}
