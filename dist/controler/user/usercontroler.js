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
exports.UserController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const HashUtils_1 = require("../../shared/utils/HashUtils");
const MailUtils_1 = require("../../shared/utils/MailUtils");
const JwtUtils_1 = require("../../shared/utils/JwtUtils");
const userPayment_1 = require("../../shared/utils/userPayment");
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
class UserController {
    //the interactor help to access the user interface repository
    constructor(interactor) {
        //signup fucntionalities and call the interactor
        //SIGN UP
        this.onSignup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body) {
                    return res
                        .status(ResponseStatus.BadRequest)
                        .json({ message: "No User Data Provided" });
                }
                const { fullname, email, password, role } = req.body;
                let NewEmail = email.toLowerCase();
                const hashedPassword = yield HashUtils_1.HashUtils.hashPassword(password);
                const existingUser = yield this._interactor.login(NewEmail);
                if (existingUser) {
                    return res
                        .status(ResponseStatus.BadRequest)
                        .json({ message: "email Already exist" });
                }
                const generateRandomString = () => {
                    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
                };
                const otp = generateRandomString();
                const mailer = MailUtils_1.SendMail.sendmail(email, otp);
                const data = yield this._interactor.signup(fullname, email, hashedPassword, otp, false, role);
                return res.status(ResponseStatus.OK).json({ message: `Check ${email}` });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        //OTP
        this.otp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { storedEmail, otp } = req.body;
            try {
                const response = this._interactor.login(storedEmail);
                response
                    .then((val) => {
                    if ((val === null || val === void 0 ? void 0 : val.otp) == otp) {
                        this._interactor.verifiedOtp(storedEmail, true);
                        return res
                            .status(ResponseStatus.OK)
                            .json({ message: `Check ${storedEmail}`, success: true });
                    }
                    else {
                        return res
                            .status(ResponseStatus.BadRequest)
                            .json({ message: "WRONG OPT", success: false });
                    }
                })
                    .catch((error) => console.log(error));
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        //LOGIN
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let { email, password } = req.body;
            try {
                console.log("login in page");
                const response = yield this._interactor.login(email);
                if (!response) {
                    return res
                        .status(ResponseStatus.NotFound)
                        .json({ message: "EMAIL NOT FOUND", success: false });
                }
                else {
                    const comparePassword = yield HashUtils_1.HashUtils.comparePassword(password, response.password);
                    if (!comparePassword) {
                        return res
                            .status(ResponseStatus.NotFound)
                            .json({ message: "WRONG PASSWORD", success: false });
                    }
                    else if (response.isBlocked) {
                        return res
                            .status(ResponseStatus.NotFound)
                            .json({ message: "YOU HAVE BLOCKED", success: false });
                    }
                    else if (!response.isVerified) {
                        return res
                            .status(ResponseStatus.NotFound)
                            .json({ message: "USER DOES NOT EXIST", success: false });
                    }
                    else {
                        console.log("SUCCES");
                        const JWTtoken = yield JwtUtils_1.JwtUtils.generateToken(response);
                        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
                        if ((response === null || response === void 0 ? void 0 : response.role) == "user") {
                            userPayment_1.userPayment.userPaymentCheck(response);
                        }
                        return res
                            .cookie("access_token", JWTtoken, {
                            expires: expiryDate,
                            httpOnly: false,
                            secure: process.env.NODE_ENV === "production", // Ensure secure attribute is set in production
                        })
                            .status(200)
                            .json({ data: response, success: true });
                    }
                }
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.user = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const response = this._interactor.user();
            response
                .then((val) => {
                return res.status(200).json({ data: val, success: true });
            })
                .catch((error) => console.log(error));
        });
        this.block = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("s");
            const { userId, action } = req.params;
            console.log(typeof userId);
            const isBlocked = action === "block";
            const response = yield this._interactor.block(userId, isBlocked);
            if (response) {
                console.log(response);
                return res.status(200).json({ success: true });
            }
            else {
                return res
                    .status(ResponseStatus.BadRequest)
                    .json({ message: "cannot proced", success: false });
            }
        });
        this.adminLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            console.log(req.body);
            const response = yield this._interactor.adminLogin(email, password);
            if (response) {
                if (response.password != password) {
                    console.log("a");
                    return res.status(401).json({
                        success: false,
                        message: "Invalid password.",
                    });
                }
                return res.status(200).json({
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
        this.resentOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { storedEmail } = req.body;
            try {
                const generateRandomString = () => {
                    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
                };
                const otp = generateRandomString();
                console.log("Generated OTP is ", otp);
                const mailer = MailUtils_1.SendMail.sendmail(storedEmail, otp);
                const response = yield this._interactor.resentOtp(storedEmail, otp);
                if (response) {
                    return res.status(200).json({
                        success: true,
                        message: "OTP succes",
                    });
                }
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.forgetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const existingUser = yield this._interactor.login(email);
            if (existingUser) {
                const generateRandomString = () => {
                    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
                };
                const otp = generateRandomString();
                console.log("Generated OTP is ", otp);
                const mailer = MailUtils_1.SendMail.sendmail(email, otp);
                const response = yield this._interactor.resentOtp(email, otp);
                return res.status(ResponseStatus.OK).json({ message: "email exist" });
            }
            return res
                .status(ResponseStatus.BadRequest)
                .json({ message: "email does not exist" });
        });
        this.restPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { password, storedEmail } = req.body;
            console.log(req.body);
            const hashedPassword = yield HashUtils_1.HashUtils.hashPassword(password);
            const existingUser = yield this._interactor.restPassword(storedEmail, hashedPassword);
            if (existingUser) {
                return res.status(ResponseStatus.OK).json({ message: "Sucess" });
            }
            return res.status(ResponseStatus.BadRequest).json({ message: "Not done" });
        });
        this.google = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body) {
                    return res
                        .status(ResponseStatus.BadRequest)
                        .json({ message: "No User Data Provided" });
                }
                const { name, email, userRole } = req.body;
                let NewEmail = email.toLowerCase();
                const hashedPassword = yield HashUtils_1.HashUtils.hashPassword(name);
                const existingUser = yield this._interactor.login(NewEmail);
                console.log(existingUser);
                if (existingUser) {
                    const JWTtoken = yield JwtUtils_1.JwtUtils.generateToken(existingUser);
                    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
                    return res
                        .cookie("access_token", JWTtoken, {
                        expires: expiryDate,
                        httpOnly: false,
                        secure: process.env.NODE_ENV === "production", // Ensure secure attribute is set in production
                    })
                        .status(200)
                        .json({ success: true, data: existingUser });
                }
                const otp = 123;
                const data = yield this._interactor.signup(name, email, hashedPassword, otp, false, userRole);
                const JWTtoken = yield JwtUtils_1.JwtUtils.generateToken(data);
                const expiryDate = new Date(Date.now() + 3600000); // 1 hour
                return res
                    .cookie("access_token", JWTtoken, {
                    expires: expiryDate,
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production", // Ensure secure attribute is set in production
                })
                    .status(200)
                    .json({ success: true, data: data });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.payment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, userId } = req.body;
            console.log(req.body, "safkshdfshkjkd");
            try {
                const data = yield this._interactor.payment(email);
                const paymentData = yield this._interactor.addPayment(userId);
                console.log(data);
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.userProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("emial", req.body);
                const { email, profession, gender, education, age, hobbies, Interest, country, linkedin, state, about, } = req.body;
                const fileData = req.file;
                const imageUrl = fileData.location;
                const data = yield this._interactor.userProfile(email, profession, gender, education, age, hobbies, Interest, country, linkedin, state, about, imageUrl);
                if (!data) {
                    return res
                        .status(ResponseStatus.BadRequest)
                        .json({ message: "something went wrong" });
                }
                return res.status(200).json({ success: true });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.userData = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let { email } = req.body;
            try {
                const existingUser = yield this._interactor.userData(email);
                if (!existingUser) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res
                    .status(ResponseStatus.OK)
                    .json({ success: true, data: existingUser });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.userDataMain = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let { email } = req.body;
            try {
                const userData = yield this._interactor.login(email);
                const uaerProfileData = yield this._interactor.userData(email);
                return res.status(ResponseStatus.OK).json({
                    success: true,
                    userData: userData,
                    profileData: uaerProfileData,
                });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.ChatAi = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let { userId, updatedChatHistory } = req.body;
            try {
                const chatHistory = updatedChatHistory;
                console.log(req.body);
                const userData = yield this._interactor.ChatAi(userId, chatHistory);
                console.log("asfasdfsa", userData);
                return res.status(ResponseStatus.OK).json({ success: true });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.ShowChatAi = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                console.log(userId);
                const userData = yield this._interactor.ShowChatAi(userId);
                console.log("asfasdfsa", userData);
                return res
                    .status(ResponseStatus.OK)
                    .json({ success: true, userData: userData });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.ChatAiDelete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.userId;
                console.log(userId);
                const userData = yield this._interactor.ChatAiDelete(userId);
                console.log("asfasdfsa", userData);
                return res
                    .status(ResponseStatus.OK)
                    .json({ success: true, userData: userData });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.proData = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            console.log(email);
            try {
                const response = yield this._interactor.login(email);
                console.log(response);
                return res.status(200).json({
                    success: true,
                    data: response,
                });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.userById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const response = yield this._interactor.userById(userId);
                return res.status(200).json({
                    success: true,
                    data: response,
                });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.checkPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { userId, password } = req.body;
            try {
                console.log(req.body);
                const response = yield this._interactor.checkPassword(userId);
                let comparePassword;
                if (response) {
                    comparePassword = yield HashUtils_1.HashUtils.comparePassword(password, response === null || response === void 0 ? void 0 : response.password);
                }
                console.log("comparePassword", comparePassword);
                if (comparePassword) {
                    return res.status(200).json({
                        success: true,
                        data: response,
                    });
                }
                else {
                    return res.status(200).json({
                        success: false,
                        data: response,
                    });
                }
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.addQuestions = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { question, name, communityId } = req.body;
            try {
                console.log(req.body);
                const response = yield this._interactor.addQuestions(question, name, communityId);
                if (response) {
                    return res.status(ResponseStatus.OK).json({ success: true });
                }
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.GetQuestions = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const communityId = req.params.Id;
            console.log("communityId", communityId);
            try {
                const response = yield this._interactor.GetQuestions(communityId);
                console.log(response);
                return res.status(200).json({
                    success: true,
                    data: response,
                });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.addAnswers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { answer, userId, questionId } = req.body;
            try {
                const response = yield this._interactor.addAnswers(answer, userId, questionId);
                if (response) {
                    return res.status(ResponseStatus.OK).json({ success: true });
                }
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.userProfileData = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let { userId } = req.body;
            try {
                const existingUser = yield this._interactor.userProfileData(userId.userId);
                const data = yield this._interactor.checkPassword(userId.userId);
                if (!existingUser) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res
                    .status(ResponseStatus.OK)
                    .json({ success: true, data: existingUser, userData: data });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.toDoPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { text, userId } = req.body;
            try {
                const data = yield this._interactor.toDoPost(text, userId);
                if (!data) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res.status(ResponseStatus.OK).json({ success: true, data: data });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.todos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.query;
            try {
                // to check if the userId is string or not , type error
                if (typeof userId !== "string") {
                    return res
                        .status(ResponseStatus.BadRequest)
                        .json({ success: false, message: "Invalid userId" });
                }
                const todos = yield this._interactor.todos(userId);
                if (!todos) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res.status(ResponseStatus.OK).json({ success: true, todos });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.completedtodos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.query;
            try {
                // to check if the userId is string or not , type error
                if (typeof userId !== "string") {
                    return res
                        .status(ResponseStatus.BadRequest)
                        .json({ success: false, message: "Invalid userId" });
                }
                const completedTodos = yield this._interactor.completedtodos(userId);
                if (!completedTodos) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res
                    .status(ResponseStatus.OK)
                    .json({ success: true, completedTodos });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.completedtodosPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { updatedTodo } = req.body;
            try {
                const completedTodos = yield this._interactor.completedtodosPost(updatedTodo._id);
                if (!completedTodos) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res
                    .status(ResponseStatus.OK)
                    .json({ success: true, completedTodos });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.todoDel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log("req.params", req.params);
            try {
                // to check if the userId is string or not , type error
                if (typeof id !== "string") {
                    return res
                        .status(ResponseStatus.BadRequest)
                        .json({ success: false, message: "Invalid userId" });
                }
                const completedTodos = yield this._interactor.todoDel(id);
                if (!completedTodos) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res
                    .status(ResponseStatus.OK)
                    .json({ success: true, completedTodos });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.completedtodoDel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log("req.params", req.params);
            try {
                // to check if the userId is string or not , type error
                if (typeof id !== "string") {
                    return res
                        .status(ResponseStatus.BadRequest)
                        .json({ success: false, message: "Invalid userId" });
                }
                const completedTodos = yield this._interactor.completedtodoDel(id);
                if (!completedTodos) {
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                }
                return res
                    .status(ResponseStatus.OK)
                    .json({ success: true, completedTodos });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this._interactor = interactor;
    }
}
exports.UserController = UserController;
