import { User } from "../../entities/user";
import { UserModel } from "../../model/userModel";

// type User = {
//   paymentDate: string;
//   _id: string;
// };

export class userPayment {
  static async userPaymentCheck(data: User): Promise<string> {
    const paymentDate = new Date(data?.paymentDate);
    const currentDate = new Date(); 
    const daysDifference =
      (currentDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDifference > 30) {
      await UserModel.findByIdAndUpdate(
        data?._id,
        {
          payment: false,
          paymentDate: "",
        },
        { new: true }
      );
      console.log("Payment has expired.");
      return "Payment has expired."; // Return a string if payment is expired
    } else {
      console.log("Payment is still valid.");
      return "Payment is still valid."; // Return a string if payment is still valid
    }
  }
}
