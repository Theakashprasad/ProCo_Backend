import { Blog } from "../../../entities/blog";
import { Payment } from "../../../entities/payment";
import { ProPayment } from "../../../entities/proPayment";
import { Admin } from "../../../entities/user";
import { Wallet } from "../../../entities/wallet";

export interface IAdminInteractor {
 
  adminLogin(email: string, password: string): Promise<Admin | null>;

  getPayment(): Promise<Payment[] | null>;

  getProPayment(): Promise<ProPayment[] | null>;

  addWallet(proId: string, numberOfUsers: number, amount: number): Promise<Wallet | null>;

  proPayStatus(proId: string): Promise<ProPayment | null>;

  blogVerify(userId: string, isBlocked: boolean): Promise<Blog | null>;

}
