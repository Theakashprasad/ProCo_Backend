"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usercontroler_1 = require("../controler/user/usercontroler");
const userRepository_1 = require("../repositories/userRepository");
const UserIntercator_1 = require("../interactor/UserIntercator");
const ValidateRequest_1 = require("../middleware/ValidateRequest");
const UserValidator_1 = require("../validators/UserValidator");
const JwtUtils_1 = require("../shared/utils/JwtUtils");
const S3bucket_1 = __importDefault(require("../shared/utils/S3bucket"));
const BlockMiddleware_1 = require("../middleware/BlockMiddleware");
const authMiddleware = BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked;
const router = (0, express_1.Router)();
// Creating a new instance of UserRepository to handle data access operations for the User entity.
const repository = new userRepository_1.UserRepository();
// Creating a new instance of UserInteractor to contain application-specific business logic and orchestrate data flow.
// UserRepository instance is injected into UserInteractor for database interaction.
const interactor = new UserIntercator_1.UserInteractor(repository);
// Creating a new instance of UserController to handle incoming HTTP requests related to user management.
// UserInteractor instance is injected into UserController to delegate business logic execution.
const controller = new usercontroler_1.UserController(interactor);
// For the test purposees
router.post("/a", (req, res) => {
    console.log(req.body);
});
router.post("/signup", (0, ValidateRequest_1.validateRequest)(UserValidator_1.userSchema), controller.onSignup.bind(controller));
router.post("/otp", controller.otp.bind(controller));
router.post("/login", (0, ValidateRequest_1.validateRequest)(UserValidator_1.loginSchema), controller.login.bind(controller));
router.get("/user", controller.user.bind(controller));
router.patch("/block/:userId/:action", controller.block.bind(controller));
//admin login
router.post("/adminLogin", controller.adminLogin.bind(controller));
router.post("/resentOtp", controller.resentOtp.bind(controller));
router.post("/forgetPassword", controller.forgetPassword.bind(controller));
router.post("/restPassword", controller.restPassword.bind(controller));
router.post("/google", controller.google.bind(controller));
router.post("/payment", controller.payment.bind(controller));
/////---PROFILE---/////
router.post("/userProfile", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, S3bucket_1.default.single("file"), controller.userProfile.bind(controller));
router.post("/userData", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, controller.userData.bind(controller));
router.post("/userDataMain", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, controller.userDataMain.bind(controller));
// router.post('userProfileData',JwtUtils.verifyToken, BlockCheckMiddleware.checkIfBlockedc , controller.userProfileData.bind(controller))
router.post("/ChatAi", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, controller.ChatAi.bind(controller));
router.get("/ShowChatAi/:id", JwtUtils_1.JwtUtils.verifyToken, controller.ShowChatAi.bind(controller));
router.post("/ChatAiDelete", JwtUtils_1.JwtUtils.verifyToken, controller.ChatAiDelete.bind(controller));
router.post("/proData", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.proData.bind(controller));
router.get("/userById/:userId", controller.userById.bind(controller));
router.post("/checkPassword", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.checkPassword.bind(controller));
// COMMUNITY QUESTION AND ANSWER
router.post("/addQuestions", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.addQuestions.bind(controller));
router.get("/GetQuestions/:Id", JwtUtils_1.JwtUtils.verifyToken, controller.GetQuestions.bind(controller));
router.post("/addAnswers", JwtUtils_1.JwtUtils.verifyToken, BlockMiddleware_1.BlockCheckMiddleware.checkIfBlocked, controller.addAnswers.bind(controller));
//This is used to see profile of user by professional pro -> user
router.post("/userProfileData", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, controller.userProfileData.bind(controller));
// todo 
router.post("/toDoPost", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, controller.toDoPost.bind(controller));
router.get("/todos", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, controller.todos.bind(controller));
router.get("/completedtodos", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, controller.completedtodos.bind(controller));
router.post("/completedtodosPost", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, controller.completedtodosPost.bind(controller));
//todo deletions
router.delete("/todoDel/:id", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, controller.todoDel.bind(controller));
router.delete("/completedtodoDel/:id", JwtUtils_1.JwtUtils.verifyToken, authMiddleware, controller.completedtodoDel.bind(controller));
exports.default = router;
