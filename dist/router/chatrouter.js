"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatControllers_1 = __importDefault(require("../controler/chat/chatControllers"));
const chatIntercator_1 = __importDefault(require("../interactor/chatIntercator"));
const messageIntercator_1 = __importDefault(require("../interactor/messageIntercator"));
const chatRepository_1 = __importDefault(require("../repositories/chatRepository"));
const messageRepository_1 = __importDefault(require("../repositories/messageRepository"));
const router = (0, express_1.Router)();
const chatRepositoryImplementation = new chatRepository_1.default();
const messageRepositoryImplementation = new messageRepository_1.default();
const chatService = new chatIntercator_1.default(chatRepositoryImplementation);
const messageService = new messageIntercator_1.default(messageRepositoryImplementation);
const chatController = new chatControllers_1.default(chatService, messageService);
router.get('/chats/:userId/getuserchats', (req, res) => chatController.getUserChats(req, res));
router.get('/:user1Id/:user2Id', (req, res) => chatController.getOrCreateChat(req, res));
router.get('/message/:chatId/messages', (req, res) => chatController.getChatMessages(req, res));
router.post('/message', (req, res) => chatController.sendMessage(req, res));
router.post('/image', (req, res) => chatController.saveImage(req, res));
// router.post('/upload', upload.single('file'), (req,res)=>chatController.sendImage(req,res))
router.post('/markAsRead', (req, res) => chatController.markAsRead(req, res));
exports.default = router;
