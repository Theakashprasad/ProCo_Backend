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
exports.ProInteractor = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class ProInteractor {
    //_repostitory help to connect the iuser repository
    constructor(repository) {
        this.verify = (fullname, Profession, subProfession, working, achievements, country, about, imageUrl, email, Linkedin) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.verify(fullname, Profession, subProfession, working, achievements, country, about, imageUrl, email, Linkedin);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.emailCheck = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repostitory.emailCheck(email);
            }
            catch (error) {
                console.error("Error in signup:", error);
                throw error;
            }
        });
        this.verifyDoc = (userId, isBlocked) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.verifyDoc(userId, isBlocked);
        });
        this.user = () => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.user();
        });
        this.blogPost = (about, image, email) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.blogPost(about, image, email);
        });
        this.Allblogs = () => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.Allblogs();
        });
        this.blogLike = (blogId, userEmail, action) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.blogLike(blogId, userEmail, action);
        });
        this.blogSave = (blogId, userId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.blogSave(blogId, userId);
        });
        this.getblogSave = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.getblogSave(id);
        });
        this.removeBlogSave = (blogId, userId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.removeBlogSave(blogId, userId);
        });
        this.connection = (senterId, folllow, receiverId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.connection(senterId, folllow, receiverId);
        });
        this.connectionFind = (receiverId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.connectionFind(receiverId);
        });
        this.connectionFindUser = (senterId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.connectionFindUser(senterId);
        });
        this.connectionFindPro = (senterId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.connectionFindPro(senterId);
        });
        this.groupVideo = (name, creator) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.groupVideo(name, creator);
        });
        this.groupVideoGet = () => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.groupVideoGet();
        });
        this.createCommunity = (userId, description, ProfilePic) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.createCommunity(userId, description, ProfilePic);
        });
        this.totalCommunity = () => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.totalCommunity();
        });
        this.communityReq = (userId, communityId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.communityReq(userId, communityId);
        });
        this.CommunityUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.CommunityUser(userId);
        });
        this.statusUpdate = (userId, communityId, status) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.statusUpdate(userId, communityId, status);
        });
        this.groupCode = (groupCode, communityId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.groupCode(groupCode, communityId);
        });
        this.proPayment = (proId, name, userId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.proPayment(proId, name, userId);
        });
        this.getWallet = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.getWallet(id);
        });
        this.getProPaymentt = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.getProPaymentt(id);
        });
        this.addQuizz = (name, questions, communityId) => __awaiter(this, void 0, void 0, function* () {
            return yield this._repostitory.addQuizz(name, questions, communityId);
        });
        this._repostitory = repository;
    }
}
exports.ProInteractor = ProInteractor;
