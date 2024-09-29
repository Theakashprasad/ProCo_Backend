import { Router } from "express";
import { BlockCheckMiddleware } from "../middleware/BlockMiddleware";
import { AdminRepository } from "../repositories/adminRepository";
import { AdminInteractor } from "../interactor/AdminIntercator";
import { AdminController } from "../controler/admin/adminControllers";
import { JwtUtils } from "../shared/utils/AdminJwt";
    const router = Router();

// Creating a new instance of UserRepository to handle data access operations for the User entity.
const repository = new AdminRepository();
// Creating a new instance of UserInteractor to contain application-specific business logic and orchestrate data flow.
// UserRepository instance is injected into UserInteractor for database interaction.
const interactor = new AdminInteractor(repository);
// Creating a new instance of UserController to handle incoming HTTP requests related to user management.
// UserInteractor instance is injected into UserController to delegate business logic execution.
const controller = new AdminController(interactor);

router.post("/adminLogin", controller.adminLogin.bind(controller));
router.get(
  "/getPayment",
  JwtUtils.verifyToken,
  controller.getPayment.bind(controller)
);
router.get(
  "/getProPayment",
  JwtUtils.verifyToken,
  controller.getProPayment.bind(controller)
);
router.post(
  "/addWallet",
  JwtUtils.verifyToken,
  controller.addWallet.bind(controller)
);
router.patch(
  "/proPayStatus/:proId",
  JwtUtils.verifyToken,
  controller.proPayStatus.bind(controller)
);

//MEDIA
router.patch(
  "/blogVerify/:userId/:action",
  JwtUtils.verifyToken,
  controller.blogVerify.bind(controller)
);
export default router;
