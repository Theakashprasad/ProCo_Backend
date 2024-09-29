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
exports.UserInteractor = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserInteractor {
    //_repostitory help to connect the iuser repository
    constructor(repository) {
        this.signup = (fullname, email, password, otp, isVerified, role) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.create(fullname, email, password, otp, isVerified, role);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.login = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this._repostitory.findByOne(email);
                return data;
            }
            catch (error) {
                console.error("Error in login:", error);
                throw error;
            }
        });
        this.verifiedOtp = (email, isVerified) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.verifiedOtp(email, isVerified);
            }
            catch (error) {
                console.error("Error in login:", error);
                throw error;
            }
        });
        this.user = () => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.user();
        });
        this.block = (userId, isBlocked) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.block(userId, isBlocked);
        });
        this.adminLogin = (email, password) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.adminLogin(email, password);
        });
        this.resentOtp = (email, otp) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.resentOtp(email, otp);
        });
        this.restPassword = (email, password) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.restPassword(email, password);
        });
        this.payment = (email) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.payment(email);
        });
        this.userProfile = (email, profession, gender, education, age, hobbies, Interest, country, linkedin, state, about, imageUrl) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.userProfile(email, profession, gender, education, age, hobbies, Interest, country, linkedin, state, about, imageUrl);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.userData = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.userData(email);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.ChatAi = (userId, chatHistory) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.ChatAi(userId, chatHistory);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.ShowChatAi = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.ShowChatAi(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.ChatAiDelete = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.ChatAiDelete(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.userById = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.userById(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.checkPassword = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.checkPassword(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.addQuestions = (question, name, communityId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.addQuestions(question, name, communityId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.GetQuestions = (communityId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.GetQuestions(communityId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.addAnswers = (answer, userId, questionId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.addAnswers(answer, userId, questionId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.userProfileData = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.userProfileData(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.toDoPost = (text, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.toDoPost(text, userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.todos = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.todos(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.completedtodos = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.completedtodos(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.completedtodosPost = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.completedtodosPost(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.todoDel = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.todoDel(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.completedtodoDel = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.completedtodoDel(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.addPayment = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.addPayment(userId);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this._repostitory = repository;
    }
}
exports.UserInteractor = UserInteractor;
