import { Router } from "express";
import { UserController } from "../controler/user/usercontroler";
import { UserRepository } from "../repositories/userRepository";
import { UserInteractor } from "../interactor/UserIntercator";
import { validateRequest } from "../middleware/ValidateRequest";
import { loginSchema, userSchema } from "../validators/UserValidator";
import { JwtUtils } from "../shared/utils/JwtUtils";
import uploadMiddlewareInstan from "../shared/utils/S3bucket";
import { BlockCheckMiddleware } from "../middleware/BlockMiddleware";
const authMiddleware = BlockCheckMiddleware.checkIfBlocked;
const router = Router();

// Creating a new instance of UserRepository to handle data access operations for the User entity.
const repository = new UserRepository();
// Creating a new instance of UserInteractor to contain application-specific business logic and orchestrate data flow.
// UserRepository instance is injected into UserInteractor for database interaction.
const interactor = new UserInteractor(repository);
// Creating a new instance of UserController to handle incoming HTTP requests related to user management.
// UserInteractor instance is injected into UserController to delegate business logic execution.
const controller = new UserController(interactor);

// For the test purposees
router.post("/a", (req, res) => {
  console.log(req.body);
});
router.post(
  "/signup",
  validateRequest(userSchema),
  controller.onSignup.bind(controller)
);
router.post("/otp", controller.otp.bind(controller));
router.post(
  "/login",
  validateRequest(loginSchema),
  controller.login.bind(controller)
);
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
router.post(
  "/userProfile",
  JwtUtils.verifyToken,
  authMiddleware,
  uploadMiddlewareInstan.single("file"),
  controller.userProfile.bind(controller)
);
router.post(
  "/userData",
  JwtUtils.verifyToken,
  authMiddleware,
  controller.userData.bind(controller)
);
router.post(
  "/userDataMain",
  JwtUtils.verifyToken,
  authMiddleware,
  controller.userDataMain.bind(controller)
);
// router.post('userProfileData',JwtUtils.verifyToken, BlockCheckMiddleware.checkIfBlockedc , controller.userProfileData.bind(controller))
router.post(
  "/ChatAi",
  JwtUtils.verifyToken,
  authMiddleware,
  controller.ChatAi.bind(controller)
);
router.get(
  "/ShowChatAi/:id",
  JwtUtils.verifyToken,
  controller.ShowChatAi.bind(controller)
);
router.post(
  "/ChatAiDelete",
  JwtUtils.verifyToken,
  controller.ChatAiDelete.bind(controller)
);
router.post(
  "/proData",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.proData.bind(controller)
);
router.get("/userById/:userId", controller.userById.bind(controller));
router.post(
  "/checkPassword",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.checkPassword.bind(controller)
);

// COMMUNITY QUESTION AND ANSWER
router.post(
  "/addQuestions",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.addQuestions.bind(controller)
);
router.get(
  "/GetQuestions/:Id",
  JwtUtils.verifyToken,
  controller.GetQuestions.bind(controller)
);
router.post(
  "/addAnswers",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.addAnswers.bind(controller)
);

//This is used to see profile of user by professional pro -> user
router.post(
  "/userProfileData",
  JwtUtils.verifyToken,
  authMiddleware,
  controller.userProfileData.bind(controller)
);

// todo 
router.post(
  "/toDoPost",
  JwtUtils.verifyToken,
  authMiddleware,
  controller.toDoPost.bind(controller)
);

router.get(
  "/todos",
  JwtUtils.verifyToken,
  authMiddleware,
  controller.todos.bind(controller)
);

router.get(
  "/completedtodos",
  JwtUtils.verifyToken, 
  authMiddleware,
  controller.completedtodos.bind(controller)
);

router.post(
  "/completedtodosPost",
  JwtUtils.verifyToken,
  authMiddleware,
  controller.completedtodosPost.bind(controller)
);
//todo deletions
router.delete(
  "/todoDel/:id",
  JwtUtils.verifyToken,
  authMiddleware,
  controller.todoDel.bind(controller)
);

router.delete(
  "/completedtodoDel/:id",
  JwtUtils.verifyToken,
  authMiddleware,
  controller.completedtodoDel.bind(controller)
);



export default router;
