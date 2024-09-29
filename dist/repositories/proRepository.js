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
exports.ProRepository = void 0;
const userModel_1 = require("../model/userModel");
// import bcrypt from "bcryptjs";
const dotenv_1 = __importDefault(require("dotenv"));
const proModel_1 = require("../model/proModel");
const blogModel_1 = require("../model/blogModel");
const connectionModel_1 = require("../model/connectionModel");
const groupVideoModel_1 = require("../model/groupVideoModel");
const communityModel_1 = require("../model/communityModel");
const proPayment_1 = require("../model/proPayment");
const wallet_1 = require("../model/wallet");
const saveBlogs_1 = require("../model/saveBlogs");
const quizModel_1 = require("../model/quizModel");
dotenv_1.default.config();
class ProRepository {
    constructor() {
        this.verify = (fullname, Profession, subProfession, working, achievements, country, about, imageUrl, email, Linkedin) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    fullname: fullname,
                    Profession: Profession,
                    subProfession: subProfession,
                    working: working,
                    achievements: achievements,
                    country: country,
                    about: about,
                    imageUrl: imageUrl,
                    email: email,
                    Linkedin: Linkedin,
                };
                let data = yield proModel_1.ProModel.create(user);
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.emailCheck = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield proModel_1.ProModel.findOne({ email });
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.verifyDoc = (userId, isBlocked) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield proModel_1.ProModel.findOneAndUpdate({ email: userId }, { $set: { request: isBlocked } }, { new: true });
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.user = () => __awaiter(this, void 0, void 0, function* () {
            const newuser = yield proModel_1.ProModel.find();
            return newuser;
        });
        this.blogPost = (about, image, email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    about: about,
                    image: image,
                    email: email,
                };
                let data = yield blogModel_1.BlogModel.create(user);
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.Allblogs = () => __awaiter(this, void 0, void 0, function* () {
            const newuser = yield blogModel_1.BlogModel.aggregate([
                {
                    $lookup: {
                        from: "pros",
                        localField: "email",
                        foreignField: "email",
                        as: "authorDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$authorDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "users", // Assuming your user collection is named "users"
                        localField: "like",
                        foreignField: "email",
                        as: "likedByUsers",
                    },
                },
                {
                    $addFields: {
                        likeCount: { $size: "$like" },
                    },
                },
                {
                    $sort: { _id: -1 }, // Sort by _id in descending order to reverse the order
                },
                {
                    $project: {
                        _id: 1,
                        about: 1,
                        image: 1,
                        email: 1,
                        block: 1,
                        like: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        authorDetails: 1,
                        likedByUsers: {
                            _id: 1,
                            email: 1,
                            fullname: 1,
                            // Add other user fields you want to include
                        },
                        likeCount: 1,
                    },
                },
            ]);
            console.log(newuser);
            return newuser;
        });
        this.blogLike = (blogId, userEmail, action) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateOperation = action
                    ? { $pull: { like: userEmail } } // Remove email if already liked
                    : { $addToSet: { like: userEmail } }; // Add email if not already liked
                const result = yield blogModel_1.BlogModel.findByIdAndUpdate(blogId, updateOperation, { new: true });
                console.log("Updated blog:", result);
                return result;
            }
            catch (error) {
                console.error("Error adding email to like array:", error);
                throw error;
            }
        });
        this.blogSave = (blogId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const existingEntry = yield saveBlogs_1.SaveBlogModel.findOne({ userID: userId });
                console.log(existingEntry, "existingEntry");
                if (existingEntry) {
                    const blogExists = existingEntry.blogId.includes(blogId);
                    if (!blogExists) {
                        existingEntry.blogId.push(blogId);
                        yield existingEntry.save();
                        console.log("BlogId added.");
                    }
                    else {
                        console.log("BlogId exist");
                        return null;
                    }
                }
                else {
                    const newEntry = new saveBlogs_1.SaveBlogModel({
                        userID: userId,
                        blogId: [blogId],
                    });
                    yield newEntry.save();
                    console.log("New document created with BlogId.");
                    return newEntry;
                }
                return existingEntry;
            }
            catch (error) {
                console.error("Error adding email to like array:", error);
                throw error;
            }
        });
        this.getblogSave = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const existingEntry = yield saveBlogs_1.SaveBlogModel.findOne({
                    userID: id,
                }).populate({
                    path: "blogId", // The field in ConnectionModel that stores sender's userId
                    model: blogModel_1.BlogModel, // The model to populate from
                    select: "about image _id like updatedAt block email", // Select only the fields you need from the UserModel
                });
                return existingEntry;
            }
            catch (error) {
                console.error("Error adding email to like array:", error);
                throw error;
            }
        });
        this.removeBlogSave = (blogId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDocument = yield saveBlogs_1.SaveBlogModel.findOneAndUpdate({ userID: userId }, // Find document by userID
                { $pull: { blogId: blogId } }, // Remove the specific blogId from the array
                { new: true } // Return the updated document
                );
                return updatedDocument;
            }
            catch (error) {
                console.error("Error adding email to like array:", error);
                throw error;
            }
        });
        this.connection = (senterId, follow, receiverId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connectionModel_1.ConnectionModel.findOneAndUpdate({ senterId, receiverId }, // Find the document where senterId and receiverId match
                { follow }, // Update the follow field
                { upsert: true, new: true, setDefaultsOnInsert: true } // Options to create if not found, return new document
                );
                return result;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.connectionFind = (receiverId) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield connectionModel_1.ConnectionModel.find({
                    receiverId: receiverId,
                }).populate({
                    path: "senterId", // The field in ConnectionModel that stores sender's userId
                    model: userModel_1.UserModel, // The model to populate from
                    select: "fullname email role", // Select only the fields you need from the UserModel
                });
                // let data = await ConnectionModel.find({ receiverId });
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.connectionFindUser = (senterId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(senterId);
                let data = yield connectionModel_1.ConnectionModel.find({ senterId: senterId }).populate({
                    path: "senterId", // The field in ConnectionModel that stores sender's userId
                    model: userModel_1.UserModel, // The model to populate from
                    select: "fullname email role", // Select only the fields you need from the UserModel
                });
                console.log(data);
                // let data = await ConnectionModel.find({ receiverId });
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.connectionFindPro = (senterId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(senterId);
                let data = yield connectionModel_1.ConnectionModel.find({ senterId: senterId }).populate({
                    path: "receiverId", // The field in ConnectionModel that stores sender's userId
                    model: proModel_1.ProModel, // The model to populate from
                    select: "fullname email Profession", // Select only the fields you need from the UserModel
                });
                console.log(data);
                // let data = await ConnectionModel.find({ receiverId });
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.groupVideo = (name, creator) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    name: name,
                    creator: creator,
                };
                let data = yield groupVideoModel_1.GroupVideoModel.create(user);
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.groupVideoGet = () => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield groupVideoModel_1.GroupVideoModel.find({}).populate({
                    path: "creator", // The field in ConnectionModel that stores sender's userId
                    model: userModel_1.UserModel, // The model to populate from
                    select: "fullname email role", // Select only the fields you need from the UserModel
                });
                return data;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.createCommunity = (userId, description, ProfilePic) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    name: description,
                    creator: userId,
                    members: [],
                    profilePic: ProfilePic,
                };
                const newCoversation = yield communityModel_1.CommunityModel.create(user);
                console.log(newCoversation);
                return newCoversation;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.totalCommunity = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const coversation = yield communityModel_1.CommunityModel.find()
                    .populate({
                    path: "creator", // Path to populate
                    select: "fullname email", // Fields to include
                    model: userModel_1.UserModel, // The model to populate from
                })
                    .exec();
                return coversation;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.communityReq = (userId, communityId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCommunity = yield communityModel_1.CommunityModel.findByIdAndUpdate(communityId, // Find the community by its ID
                {
                    $push: {
                        members: { userId }, // Push new member to the members array
                    },
                }, { new: true, useFindAndModify: false } // Return the updated document
                ).exec();
                return updatedCommunity;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.CommunityUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCommunity = yield communityModel_1.CommunityModel.findById(userId)
                    .populate({
                    path: "members.userId", // Path to populate
                    select: "fullname email", // Fields to include
                    model: userModel_1.UserModel, // The model to populate from
                })
                    .exec();
                return updatedCommunity;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.statusUpdate = (userId, communityId, status) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCommunity = yield communityModel_1.CommunityModel.findOneAndUpdate({
                    _id: communityId,
                    "members.userId": userId,
                    "members.status": "pending",
                }, {
                    $set: { "members.$.status": status },
                }, { new: true } // Optionally return the updated document
                );
                return updatedCommunity;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.groupCode = (groupCode, communityId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCommunity = yield communityModel_1.CommunityModel.findOneAndUpdate({ _id: communityId }, { $set: { groupCode: groupCode } }, // Update the groupCode field and updatedAt
                { new: true } // Optionally return the updated document
                );
                return updatedCommunity;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.proPayment = (proId, name, userId) => __awaiter(this, void 0, void 0, function* () {
            const dateObj = new Date();
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-based
            const day = String(dateObj.getDate()).padStart(2, "0");
            const hours = String(dateObj.getHours()).padStart(2, "0");
            const minutes = String(dateObj.getMinutes()).padStart(2, "0");
            const seconds = String(dateObj.getSeconds()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            try {
                let payment = yield proPayment_1.PaymentProModel.findOne({ proId, status: false });
                if (payment) {
                    const userExists = payment.users.some((user) => user.userId === userId);
                    if (!userExists) {
                        payment.users.push({ userId, date: formattedDate });
                        payment.amount += 500 * 0.9; // Increment the amount by 500
                        yield payment.save();
                        console.log("User added to existing payment document.");
                    }
                    else {
                        console.log("User already exists in the payment document.");
                    }
                }
                else {
                    payment = new proPayment_1.PaymentProModel({
                        proId,
                        name: name, // You can change this to a relevant name
                        users: [{ userId, date: formattedDate }],
                        amount: 500 * 0.9, // Set the default amount, update if needed
                        status: false, // You can change this as per your logic
                    });
                    yield payment.save();
                    console.log("New payment document created and user added.");
                }
                return payment;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.getWallet = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCommunity = yield wallet_1.WalletModel.find({ proId: id }).sort({
                    _id: -1,
                });
                return updatedCommunity;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.getProPaymentt = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCommunity = yield proPayment_1.PaymentProModel.find({
                    proId: id,
                }).populate({
                    path: "users.userId", // Path to populate
                    model: userModel_1.UserModel, // Use the model name as a string
                    select: "fullname", // Specify which fields to include from the User model
                });
                return updatedCommunity;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
        this.addQuizz = (name, questions, communityId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const quiz = {
                    name,
                    questions,
                    communityId,
                };
                const newQuiz = yield quizModel_1.Quiz.create(quiz);
                return newQuiz;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
    }
}
exports.ProRepository = ProRepository;
