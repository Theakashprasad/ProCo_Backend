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
exports.AdminInteractor = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AdminInteractor {
    //_repostitory help to connect the iuser repository
    constructor(repository) {
        this.adminLogin = (email, password) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.adminLogin(email, password);
        });
        this.getPayment = () => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.getPayment();
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.getProPayment = () => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.getProPayment();
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.addWallet = (proId, numberOfUsers, amount) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.addWallet(proId, numberOfUsers, amount);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.proPayStatus = (proId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.proPayStatus(proId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.blogVerify = (userId, isBlocked) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.blogVerify(userId, isBlocked);
        });
        this._repostitory = repository;
    }
}
exports.AdminInteractor = AdminInteractor;
