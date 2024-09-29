import { Admin } from "../entities/user";
import dotenv from "dotenv";
import { IAdminInteractor } from "../providers/interface/admin/IAdminInteractor";
import { IAdminrRepository } from "../providers/interface/admin/IAdminRepository";
import { Payment } from "../entities/payment";
import { ProPayment } from "../entities/proPayment";
import { Wallet } from "../entities/wallet";
import { Blog } from "../entities/blog";

dotenv.config();

export class AdminInteractor implements IAdminInteractor {
  private _repostitory: IAdminrRepository;

  //_repostitory help to connect the iuser repository
  constructor(repository: IAdminrRepository) {
    this._repostitory = repository;
  }

  adminLogin = async (
    email: string,
    password: string
  ): Promise<Admin | null> => {
    return await this._repostitory.adminLogin(email, password);
  };

  getPayment = async (): Promise<Payment[] | null> => {
    try {
      return await this._repostitory.getPayment();
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  getProPayment = async (): Promise<ProPayment[] | null> => {
    try {
      return await this._repostitory.getProPayment();
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  addWallet = async (
    proId: string,
    numberOfUsers: number,
    amount: number
  ): Promise<Wallet | null> => {
    try {
      return await this._repostitory.addWallet(proId, numberOfUsers, amount);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  proPayStatus = async (proId: string): Promise<ProPayment | null> => {
    try {
      return await this._repostitory.proPayStatus(proId);
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  blogVerify = async (
    userId: string,
    isBlocked: boolean
  ): Promise<Blog | null> => {
    return await this._repostitory.blogVerify(userId, isBlocked);
  };
}
