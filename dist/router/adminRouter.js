"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminRepository_1 = require("../repositories/adminRepository");
const AdminIntercator_1 = require("../interactor/AdminIntercator");
const adminControllers_1 = require("../controler/admin/adminControllers");
const AdminJwt_1 = require("../shared/utils/AdminJwt");
const router = (0, express_1.Router)();
// Creating a new instance of UserRepository to handle data access operations for the User entity.
const repository = new adminRepository_1.AdminRepository();
// Creating a new instance of UserInteractor to contain application-specific business logic and orchestrate data flow.
// UserRepository instance is injected into UserInteractor for database interaction.
const interactor = new AdminIntercator_1.AdminInteractor(repository);
// Creating a new instance of UserController to handle incoming HTTP requests related to user management.
// UserInteractor instance is injected into UserController to delegate business logic execution.
const controller = new adminControllers_1.AdminController(interactor);
router.post("/adminLogin", controller.adminLogin.bind(controller));
router.get("/getPayment", AdminJwt_1.JwtUtils.verifyToken, controller.getPayment.bind(controller));
router.get("/getProPayment", AdminJwt_1.JwtUtils.verifyToken, controller.getProPayment.bind(controller));
router.post("/addWallet", AdminJwt_1.JwtUtils.verifyToken, controller.addWallet.bind(controller));
router.patch("/proPayStatus/:proId", AdminJwt_1.JwtUtils.verifyToken, controller.proPayStatus.bind(controller));
//MEDIA
router.patch("/blogVerify/:userId/:action", AdminJwt_1.JwtUtils.verifyToken, controller.blogVerify.bind(controller));
exports.default = router;
