"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const procontroler_1 = require("../controler/professional/procontroler");
const proRepository_1 = require("../repositories/proRepository");
const ProInteractor_1 = require("../interactor/ProInteractor");
const S3bucket_1 = __importDefault(require("../shared/utils/S3bucket"));
const ImageMulter_1 = __importDefault(require("../shared/utils/ImageMulter"));
const DirectMail_1 = __importDefault(require("../shared/utils/DirectMail"));
const JwtUtils_1 = require("../shared/utils/JwtUtils");
const BlockMiddleware_1 = require("../middleware/BlockMiddleware");
const router = (0, express_1.Router)();
// Creating a new instance of UserRepository to handle data access operations for the User entity.
const repository = new proRepository_1.ProRepository();
// Creating a new instance of UserInteractor to contain application-specific business logic and orchestrate data flow.
// UserRepository instance is injected into UserInteractor for database interaction.
const interactor = new ProInteractor_1.ProInteractor(repository);
// Creating a new instance of UserController to handle incoming HTTP requests related to user management.
// UserInteractor instance is injected into UserController to delegate business logic execution.
const controller = new procontroler_1.ProController(interactor);
router.post("/proVerify", S3bucket_1.default.single("file"), controller.verify.bind(controller));
router.post("/emailCheck", controller.emailCheck.bind(controller));
router.post("/verifyDoc/:userId/:action", controller.verifyDoc.bind(controller));
router.get("/user", controller.user.bind(controller));
router.post("/proDoc/:email", controller.proDoc.bind(controller));
//BLOG
router.post("/blogPost", ImageMulter_1.default, controller.blogPost.bind(controller));
router.get("/Allblogs", controller.Allblogs.bind(controller)); //used to get all blogs data
router.post("/blogSave", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.blogSave.bind(controller));
router.get("/getblogSave/:id", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.getblogSave.bind(controller));
router.patch("/removeBlogSave/:userId/:blogId", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.removeBlogSave.bind(controller));
router.post("/blogLike", controller.blogLike.bind(controller));
router.post("/connection/:senterId/:follow/:receiverId", controller.connection.bind(controller));
router.get("/connectionFind/:receiverId", controller.connectionFind.bind(controller)); //pro id
router.get("/connectionFindUser/:senterId", controller.connectionFindUser.bind(controller)); //user id
router.get("/connectionFindPro/:senterId", controller.connectionFindPro.bind(controller)); //user id
//GROUP VIDEO CALL
router.post("/groupVideo", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.groupVideo.bind(controller));
router.get("/groupVideoGet", JwtUtils_1.JwtUtils.verifyToken, controller.groupVideoGet.bind(controller));
//COMMUNITY
router.post("/createCommunity", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.createCommunity.bind(controller));
router.get("/totalCommunity", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.totalCommunity.bind(controller));
router.post("/communityReq", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.communityReq.bind(controller));
router.get("/CommunityUser/:userId", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.CommunityUser.bind(controller));
// accept or reject
router.post("/statusUpdate", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.statusUpdate.bind(controller));
router.post("/groupCode", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.groupCode.bind(controller));
// PAYMENT
router.post("/proPayment", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.proPayment.bind(controller));
//WALLET
router.get("/getWallet/:id", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.getWallet.bind(controller));
router.get("/getProPaymentt/:id", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.getProPaymentt.bind(controller));
//QUIZZ
router.post("/addQuizz", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.addQuizz.bind(controller));
router.post("/a", (req, res) => {
    console.log("sd");
    const mailService = new DirectMail_1.default();
    mailService
        .sendMail({
        email: "akashprasadyt123@gmail.com",
        subject: "Access Request",
        text: "http://localhost:3002/standBy",
    })
        .catch((error) => {
        console.error("Failed to send email:", error);
    });
});
exports.default = router;
