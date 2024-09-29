import { Router } from "express";
import ChatController from "../controler/chat/chatControllers";
import ChatService from "../interactor/chatIntercator";
import MessageService from "../interactor/messageIntercator";
import ChatRepositoryImplementation from "../repositories/chatRepository";
import MessageRepositoryImplementation from "../repositories/messageRepository";
import upload from "../shared/utils/S3bucket";

const router = Router();

const chatRepositoryImplementation = new ChatRepositoryImplementation();
const messageRepositoryImplementation = new MessageRepositoryImplementation();
const chatService = new ChatService(chatRepositoryImplementation);
const messageService = new MessageService(messageRepositoryImplementation);
const chatController = new ChatController(chatService, messageService);

router.get('/chats/:userId/getuserchats', (req,res)=> chatController.getUserChats(req,res))
router.get('/:user1Id/:user2Id',  (req, res) => chatController.getOrCreateChat(req, res));
router.get('/message/:chatId/messages',  (req, res) => chatController.getChatMessages(req, res));
router.post('/message', (req, res) => chatController.sendMessage(req, res));
router.post('/image',(req,res)=>chatController.saveImage(req,res))
// router.post('/upload', upload.single('file'), (req,res)=>chatController.sendImage(req,res))
    router.post('/markAsRead', (req,res)=> chatController.markAsRead(req,res))
export default router;