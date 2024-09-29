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
exports.UserRepository = void 0;
const userModel_1 = require("../model/userModel");
const dotenv_1 = __importDefault(require("dotenv"));
const adminModel_1 = require("../model/adminModel");
const useProfile_1 = require("../model/useProfile");
const aiChat_1 = require("../model/aiChat");
const questionModel_1 = require("../model/questionModel");
const toModel_1 = require("../model/toModel");
const payment_1 = require("../model/payment");
dotenv_1.default.config();
class UserRepository {
    constructor() {
        this.create = (fullname, email, password, otp, isVerified, role) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    fullname: fullname,
                    email: email,
                    password: password,
                    otp: otp,
                    isVerified: isVerified,
                    role: role,
                };
                const newuser = yield userModel_1.UserModel.create(user);
                console.log(newuser, "created");
                return newuser;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.findByOne = (email) => __awaiter(this, void 0, void 0, function* () {
            const newuser = yield userModel_1.UserModel.findOne({ email });
            return newuser;
        });
        this.verifiedOtp = (email, isVerified) => __awaiter(this, void 0, void 0, function* () {
            const newuser = yield userModel_1.UserModel.findOneAndUpdate({ email }, {
                $set: { isVerified: true },
            }, { new: true } // Return the updated document
            );
            return newuser;
        });
        this.user = () => __awaiter(this, void 0, void 0, function* () {
            const newuser = yield userModel_1.UserModel.find();
            return newuser;
        });
        this.block = (userId, isBlocked) => __awaiter(this, void 0, void 0, function* () {
            return yield userModel_1.UserModel.findByIdAndUpdate(userId, { isBlocked }, { new: true });
        });
        this.adminLogin = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield adminModel_1.AdminModel.findOne({ email });
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.resentOtp = (email, otp) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newuser = yield userModel_1.UserModel.findOneAndUpdate({ email }, {
                    $set: { otp: otp },
                }, { new: true } // Return the updated document
                );
                return newuser;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.restPassword = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newuser = yield userModel_1.UserModel.findOneAndUpdate({ email }, {
                    $set: { password: password },
                }, { new: true } // Return the updated document
                );
                return newuser;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.payment = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newuser = yield userModel_1.UserModel.findOneAndUpdate({ email }, {
                    $set: { payment: true, paymentDate: new Date() },
                }, { new: true } // Return the updated document
                );
                return newuser;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.userProfile = (email, profession, gender, education, age, hobbies, Interest, country, linkedin, state, about, imageUrl) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    email: email,
                    profession: profession,
                    gender: gender,
                    education: education,
                    hobbies: hobbies,
                    Interest: Interest,
                    country: country,
                    Linkedin: linkedin,
                    state: state,
                    age: age,
                    about: about,
                    imageUrl: imageUrl,
                };
                yield useProfile_1.UserProfileModel.updateOne({ email: email }, // Filter
                { $set: user }, // Update data
                { upsert: true } // Create new document if no match is found
                );
                // Fetch and return the updated or newly created document
                const updatedUser = yield useProfile_1.UserProfileModel.findOne({ email: email })
                    .lean()
                    .exec();
                if (!updatedUser) {
                    throw new Error("Failed to retrieve the updated user profile.");
                }
                return updatedUser;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.userData = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield useProfile_1.UserProfileModel.findOne({ email });
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.ChatAi = (userId, chatHistory) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = yield aiChat_1.ChatAiModel.findOneAndUpdate({ userId }, // Filter to find by userId
                { chatHistory }, // Update the chatHistory by appending new messages
                { new: true, upsert: true } // Create if not found, and return the updated document
                );
                return newMessage;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.ShowChatAi = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = yield aiChat_1.ChatAiModel.findOne({ userId });
                return newMessage;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.ChatAiDelete = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedChat = yield aiChat_1.ChatAiModel.findOneAndDelete({ userId });
                return deletedChat;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.userById = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield userModel_1.UserModel.findById(userId);
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.checkPassword = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield userModel_1.UserModel.findById(userId);
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.addQuestions = (question, name, communityId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield questionModel_1.QuestionModel.create({
                    question: question,
                    name: name,
                    communityId: communityId
                });
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.GetQuestions = (communityId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield questionModel_1.QuestionModel.find({ communityId })
                    .populate({
                    path: "answers.userId", // Path to populate
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
        this.addAnswers = (answer, userId, questionId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedQuestion = yield questionModel_1.QuestionModel.findByIdAndUpdate(questionId, {
                    $push: {
                        answers: { userId, content: answer },
                    },
                }, { new: true } // Return the updated document
                );
                return updatedQuestion;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.userProfileData = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId);
                const data = yield userModel_1.UserModel.findById(userId);
                let val = yield useProfile_1.UserProfileModel.findOne({ email: data === null || data === void 0 ? void 0 : data.email });
                return val;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.toDoPost = (text, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId);
                const newTodo = {
                    text,
                    userId,
                    status: false,
                };
                const savedTodo = yield toModel_1.ToDoModel.create(newTodo);
                // const savedTodo = await newTodo.save();
                return savedTodo;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.todos = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId);
                const todos = yield toModel_1.ToDoModel.find({ userId, status: false }).sort({ _id: -1 });
                return todos;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.completedtodos = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId);
                const todos = yield toModel_1.ToDoModel.find({ userId, status: true });
                return todos;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.completedtodosPost = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield toModel_1.ToDoModel.findByIdAndUpdate(userId, { status: true, updatedAt: new Date() }, { new: true });
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.todoDel = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield toModel_1.ToDoModel.findByIdAndDelete(userId);
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.completedtodoDel = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield toModel_1.ToDoModel.findByIdAndDelete(userId);
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.addPayment = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield payment_1.PaymentModel.create({ userId });
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;
