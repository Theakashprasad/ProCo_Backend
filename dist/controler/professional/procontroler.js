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
exports.ProController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const DirectMail_1 = __importDefault(require("../../shared/utils/DirectMail"));
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
class ProController {
    //the interactor help to access the user interface repository
    constructor(interactor) {
        //signup fucntionalities and call the interactor
        this.verify = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullname, Profession, subProfession, working, achievements, country, about, email, Linkedin, } = req.body;
                const fileData = req.file;
                const imageUrl = fileData.location;
                const data = yield this._interactor.verify(fullname, Profession, subProfession, working, achievements, country, about, imageUrl, email, Linkedin);
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
        this.emailCheck = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let { email } = req.body;
            try {
                const existingUser = yield this._interactor.emailCheck(email);
                if (!existingUser) {
                    return res.status(ResponseStatus.OK).json({ success: false });
                }
                return res
                    .status(ResponseStatus.OK)
                    .json({ success: true, data: existingUser });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.verifyDoc = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, action } = req.params;
                const isBlocked = action === "true";
                const response = yield this._interactor.verifyDoc(userId, isBlocked);
                if (response) {
                    const mailService = new DirectMail_1.default();
                    mailService
                        .sendMail({
                        email: "akashprasadyt123@gmail.com",
                        subject: "Access Request",
                        text: "http://localhost:3000/login",
                    })
                        .catch((error) => {
                        console.error("Failed to send email:", error);
                    });
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
        this.user = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const response = this._interactor.user();
            response
                .then((val) => {
                return res.status(200).json({ data: val, success: true });
            })
                .catch((error) => {
                return res.status(ResponseStatus.BadRequest).json(error);
            });
        });
        this.proDoc = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = req.params.email;
            console.log("email", email);
            try {
                const existingUser = yield this._interactor.emailCheck(email);
                console.log(existingUser);
                if (existingUser)
                    return res.status(200).json({ data: existingUser, success: true });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.blogPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, about } = req.body;
            const fileData = req.files;
            console.log("fileData", fileData);
            const image = fileData["cropped_image"].map((image) => image.location);
            console.log("imageData", image);
            // const image = fileData.location;
            // console.log('fileData', image);
            try {
                const existingUser = yield this._interactor.blogPost(about, image, email);
                if (!existingUser)
                    return res.status(ResponseStatus.BadRequest).json({ success: false });
                return res.status(200).json({ data: existingUser, success: true });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.Allblogs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this._interactor.Allblogs();
                if (existingUser)
                    return res.status(200).json({ data: existingUser, success: true });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.blogSave = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { blogId, userId } = req.body;
            console.log("object", blogId);
            try {
                const existingUser = yield this._interactor.blogSave(blogId, userId);
                if (existingUser)
                    return res.status(200).json({ data: existingUser, success: true });
                else
                    return res.status(200).json({ success: false });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.getblogSave = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const existingUser = yield this._interactor.getblogSave(id);
                console.log("asdfasdf", existingUser);
                if (existingUser)
                    return res.status(200).json({ data: existingUser, success: true });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.removeBlogSave = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { blogId, userId } = req.params;
            try {
                const existingUser = yield this._interactor.removeBlogSave(blogId, userId);
                console.log("existingUser", existingUser);
                if (existingUser) {
                    return res.status(200).json({ data: existingUser, success: true });
                }
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.blogLike = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { blogId, userEmail, action } = req.body;
            console.log("email", req.body);
            try {
                const existingUser = yield this._interactor.blogLike(blogId, userEmail, action);
                if (existingUser)
                    return res.status(200).json({ data: existingUser, success: true });
            }
            catch (error) {
                return res.status(ResponseStatus.BadRequest).json(error);
            }
        });
        this.connection = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { senterId, follow, receiverId } = req.params;
                console.log("req.params", req.params);
                const response = yield this._interactor.connection(senterId, follow, receiverId);
                console.log("response", response);
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
        this.connectionFind = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { receiverId } = req.params;
                console.log(req.params);
                const response = yield this._interactor.connectionFind(receiverId);
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.connectionFindUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { senterId } = req.params;
                console.log("senterId", senterId);
                const response = yield this._interactor.connectionFindUser(senterId);
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.connectionFindPro = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { senterId } = req.params;
                console.log("senterId", senterId);
                const response = yield this._interactor.connectionFindPro(senterId);
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.groupVideo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, creator } = req.body;
                console.log(req.body);
                const response = yield this._interactor.groupVideo(name, creator);
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.groupVideoGet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._interactor.groupVideoGet();
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.createCommunity = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { creator, name } = req.body;
                console.log(req.body);
                const ProfilePic = "https://avatar.iran.liara.run/public/boy";
                const response = yield this._interactor.createCommunity(creator, name, ProfilePic);
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.totalCommunity = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._interactor.totalCommunity();
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.communityReq = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, communityId } = req.body;
                console.log(req.body);
                const response = yield this._interactor.communityReq(userId, communityId);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.CommunityUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const response = yield this._interactor.CommunityUser(userId);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.statusUpdate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, communityId, status } = req.body;
                const response = yield this._interactor.statusUpdate(userId, communityId, status);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.groupCode = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { groupCode, communityId } = req.body;
                console.log("assss", req.body);
                const response = yield this._interactor.groupCode(groupCode, communityId);
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.proPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { proId, name, userId } = req.body;
                const response = yield this._interactor.proPayment(proId, name, userId);
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.getWallet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const response = yield this._interactor.getWallet(id);
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.getProPaymentt = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const response = yield this._interactor.getProPaymentt(id);
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
        this.addQuizz = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { name, questions, communityId } = req.body;
            try {
                const response = yield this._interactor.addQuizz(name, questions, communityId);
                console.log("response", response);
                if (response) {
                    return res.status(200).json({ success: true, data: response });
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
exports.ProController = ProController;
