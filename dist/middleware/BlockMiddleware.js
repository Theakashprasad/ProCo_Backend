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
exports.BlockCheckMiddleware = void 0;
const userModel_1 = require("../model/userModel");
class BlockCheckMiddleware {
    static checkIfBlocked(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (!userId) {
                    return res.status(400).json({ message: "Email is required" });
                }
                const user = yield userModel_1.UserModel.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                if (user.isBlocked) {
                    console.log(" bloked");
                    return res.status(403).json({ message: "User is blocked" });
                }
                console.log("not bloked");
                next();
            }
            catch (error) {
                console.error("Error checking if user is blocked:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.BlockCheckMiddleware = BlockCheckMiddleware;
