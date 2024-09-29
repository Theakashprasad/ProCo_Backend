"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPayment = void 0;
const userModel_1 = require("../../model/userModel");
// type User = {
//   paymentDate: string;
//   _id: string;
// };
class userPayment {
    static userPaymentCheck(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentDate = new Date(data === null || data === void 0 ? void 0 : data.paymentDate);
            const currentDate = new Date();
            const daysDifference = (currentDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysDifference > 30) {
                yield userModel_1.UserModel.findByIdAndUpdate(data === null || data === void 0 ? void 0 : data._id, {
                    payment: false,
                    paymentDate: "",
                }, { new: true });
                console.log("Payment has expired.");
                return "Payment has expired."; // Return a string if payment is expired
            }
            else {
                console.log("Payment is still valid.");
                return "Payment is still valid."; // Return a string if payment is still valid
            }
        });
    }
}
exports.userPayment = userPayment;
