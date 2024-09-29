import { Router } from "express";
import { ProController } from "../controler/professional/procontroler";
import { ProRepository } from "../repositories/proRepository";
import { ProInteractor } from "../interactor/ProInteractor";
import uploadMiddlewareInstan from "../shared/utils/S3bucket";
import uploadMiddlewareInstance from "../shared/utils/ImageMulter";
import MailService from "../shared/utils/DirectMail";
import { JwtUtils } from "../shared/utils/JwtUtils";
import { BlockCheckMiddleware } from "../middleware/BlockMiddleware";
const router = Router();

// Creating a new instance of UserRepository to handle data access operations for the User entity.
const repository = new ProRepository();
// Creating a new instance of UserInteractor to contain application-specific business logic and orchestrate data flow.
// UserRepository instance is injected into UserInteractor for database interaction.
const interactor = new ProInteractor(repository);
// Creating a new instance of UserController to handle incoming HTTP requests related to user management.
// UserInteractor instance is injected into UserController to delegate business logic execution.
const controller = new ProController(interactor);

router.post(
  "/proVerify",
  uploadMiddlewareInstan.single("file"),
  controller.verify.bind(controller)
);
router.post("/emailCheck", controller.emailCheck.bind(controller));
router.post(
  "/verifyDoc/:userId/:action",
  controller.verifyDoc.bind(controller)
);
router.get("/user", controller.user.bind(controller));
router.post("/proDoc/:email", controller.proDoc.bind(controller));

//BLOG
router.post(
  "/blogPost",
  uploadMiddlewareInstance,
  controller.blogPost.bind(controller)
);
router.get("/Allblogs", controller.Allblogs.bind(controller)); //used to get all blogs data
router.post(
  "/blogSave",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.blogSave.bind(controller)
);
router.get(
  "/getblogSave/:id",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.getblogSave.bind(controller)
);
router.patch(
  "/removeBlogSave/:userId/:blogId",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.removeBlogSave.bind(controller)
);
router.post("/blogLike", controller.blogLike.bind(controller));
router.post(
  "/connection/:senterId/:follow/:receiverId",
  controller.connection.bind(controller)
);
router.get(
  "/connectionFind/:receiverId",
  controller.connectionFind.bind(controller)
); //pro id
router.get(
  "/connectionFindUser/:senterId",
  controller.connectionFindUser.bind(controller)
); //user id
router.get(
  "/connectionFindPro/:senterId",
  controller.connectionFindPro.bind(controller)
); //user id
//GROUP VIDEO CALL
router.post(
  "/groupVideo",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.groupVideo.bind(controller)
);
router.get(
  "/groupVideoGet",
  JwtUtils.verifyToken,
  controller.groupVideoGet.bind(controller)
);
//COMMUNITY
router.post(
  "/createCommunity",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.createCommunity.bind(controller)
);
router.get(
  "/totalCommunity",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.totalCommunity.bind(controller)
);
router.post(
  "/communityReq",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.communityReq.bind(controller)
);
router.get(
  "/CommunityUser/:userId",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.CommunityUser.bind(controller)
);
// accept or reject
router.post(
  "/statusUpdate",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.statusUpdate.bind(controller)
);
router.post(
  "/groupCode",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.groupCode.bind(controller)
);

// PAYMENT
router.post(
  "/proPayment",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.proPayment.bind(controller)
);

//WALLET
router.get(
  "/getWallet/:id",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.getWallet.bind(controller)
);

router.get(
  "/getProPaymentt/:id",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.getProPaymentt.bind(controller)
);

//QUIZZ
router.post(
  "/addQuizz",
  JwtUtils.verifyToken,
  BlockCheckMiddleware.checkIfBlocked,
  controller.addQuizz.bind(controller)
);

router.post("/a", (req, res) => {
  console.log("sd");
  const mailService = new MailService();
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

export default router;
