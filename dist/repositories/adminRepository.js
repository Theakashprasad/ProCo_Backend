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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const userModel_1 = require("../model/userModel");
const dotenv_1 = __importDefault(require("dotenv"));
const adminModel_1 = require("../model/adminModel");
const payment_1 = require("../model/payment");
const proPayment_1 = require("../model/proPayment");
const wallet_1 = require("../model/wallet");
const blogModel_1 = require("../model/blogModel");
dotenv_1.default.config();
class AdminRepository {
    constructor() {
        this.adminLogin = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield adminModel_1.AdminModel.findOne({ email });
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.getPayment = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield payment_1.PaymentModel.find();
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.getProPayment = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield proPayment_1.PaymentProModel.find()
                    .populate({
                    path: "users.userId", // Path to populate
                    model: userModel_1.UserModel, // Use the model name as a string
                    select: "fullname", // Specify which fields to include from the User model
                })
                    .exec(); // Execute the query
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.addWallet = (proId, numberOfUsers, amount) => __awaiter(this, void 0, void 0, function* () {
            const data = {
                proId,
                numberOfUsers,
                amount,
            };
            try {
                const result = yield wallet_1.WalletModel.create(data);
                return result;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.proPayStatus = (proId) => __awaiter(this, void 0, void 0, function* () {
            let result = null;
            try {
                const falseStatusPayment = yield proPayment_1.PaymentProModel.findOne({
                    proId,
                    status: false,
                });
                if (falseStatusPayment) {
                    falseStatusPayment.status = true;
                    result = yield falseStatusPayment.save();
                }
                return result;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.blogVerify = (userId, isBlocked) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield blogModel_1.BlogModel.findOneAndUpdate({ _id: userId }, { $set: { block: isBlocked } }, { new: true });
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
