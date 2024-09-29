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
exports.AdminController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const AdminJwt_1 = require("../../shared/utils/AdminJwt");
dotenv_1.default.config();
//set enum for each reponse message
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["OK"] = 200] = "OK";
    ResponseStatus[ResponseStatus["Created"] = 201] = "Created";
    ResponseStatus[ResponseStatus["Accepted"] = 202] = "Accepted";
    ResponseStatus[ResponseStatus["BadRequest"] = 400] = "BadRequest";
    ResponseStatus[ResponseStatus["Unauthorized"] = 401] = "Unauthorized";
    ResponseStatus[ResponseStatus["Forbidden"] = 403] = "Forbidden";
    ResponseStatus[ResponseStatus["NotFound"] = 404] = "NotFound";
})(ResponseStatus || (ResponseStatus = {}));
class AdminController {
    //the interactor help to access the user interface repository
    constructor(interactor) {
        this.adminLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            console.log("admin", req.body);
            const response = yield this._interactor.adminLogin(email, password);
            if (response) {
                if (response.password != password) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid password.",
                    });
                }
                const JWTtoken = yield AdminJwt_1.JwtUtils.generateToken(response);
                const expiryDate = new Date(Date.now() + 3600000); // 1 hour
                return res
                    .cookie("access_Admin_token", JWTtoken, {
                    expires: expiryDate,
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production", // Ensure secure attribute is set in production 
                })
                    .status(200)
                    .json({
                    success: true,
                    message: "Login succes",
                });
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password.",
                });
            }
        });
        this.getPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._interactor.getPayment();
                if (!data) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res.status(ResponseStatus.OK).json({ success: true, data });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.getProPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._interactor.getProPayment();
                if (!data) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res.status(ResponseStatus.OK).json({ success: true, data });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.addWallet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { proId, numberOfUsers, amount } = req.body;
            try {
                const data = yield this._interactor.addWallet(proId, numberOfUsers, amount);
                if (!data) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res.status(ResponseStatus.OK).json({ success: true, data });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.proPayStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { proId } = req.params;
            try {
                const data = yield this._interactor.proPayStatus(proId);
                if (!data) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res.status(ResponseStatus.OK).json({ success: true, data });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.blogVerify = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, action } = req.params;
                console.log("blof", req.params);
                const isBlocked = action === 'true';
                console.log(isBlocked);
                const response = yield this._interactor.blogVerify(userId, isBlocked);
                console.log('response', response);
                if (response) {
                    return res.status(200).json({ success: true });
                }
                else {
                    return res
                        .status(ResponseStatus.BadRequest)
                        .json({ message: "cannot proced", success: false });
                }
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this._interactor = interactor;
    }
}
exports.AdminController = AdminController;
