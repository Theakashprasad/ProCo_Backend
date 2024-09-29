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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const proRouter_1 = __importDefault(require("./router/proRouter"));
const chatrouter_1 = __importDefault(require("./router/chatrouter"));
const adminRouter_1 = __importDefault(require("./router/adminRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
(0, dbConfig_1.default)();
// const io = require("socket.io")(8080, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: []
//   },
// });
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use("/api/", userRouter_1.default);
app.use("/api/pro/", proRouter_1.default);
app.use("/api/chat/", chatrouter_1.default);
app.use("/api/admin/", adminRouter_1.default);
app.get("/", (req, res) => {
    res.send("hy");
});
const userSocketMap = new Map();
io.on('connection', (socket) => {
    socket.on('user_connected', (userId) => {
        console.log('User connected:', userId);
        userSocketMap.set(userId, socket.id);
    });
    socket.on('join chat', (chatData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { chatId } = chatData;
            if (chatId) {
                socket.join(`chat_${chatId}`);
                console.log(`User joined chat ${chatId}`);
            }
            else {
                console.error("Chat ID is missing");
            }
        }
        catch (error) {
            console.error("Error in join chat:", error);
        }
    }));
    socket.on('chat message', (messageData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('chat message', messageData);
            const { chatId, senderId, receiverId, messageText, createdAt } = messageData;
            if (chatId && senderId && receiverId && messageText && createdAt) {
                const receiverSocketId = userSocketMap.get(receiverId);
                io.to(receiverSocketId).emit('chat message', { chatId, senderId, messageText, createdAt });
            }
            else {
                console.error("Message data is incomplete");
            }
        }
        catch (error) {
            console.error("Error in chat message:", error);
        }
    }));
    socket.on('call', (participants) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { caller, receiver } = participants;
            console.log(participants, 'call');
            if (participants) {
                console.log('incomingCall');
                const receiverSocketId = userSocketMap.get(receiver._id);
                console.log(receiverSocketId, 'sp');
                io.to(receiverSocketId).emit('incomingCall', { caller, receiver });
            }
            else {
                console.error("Call data is incomplete");
            }
        }
        catch (error) {
            console.error("Error in calling:", error);
        }
    }));
    socket.on('hangupDuringInitiation', (ongoingCall) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Hangup during initiation event received:', ongoingCall);
            const { participants } = ongoingCall;
            if (participants && participants.caller && participants.receiver) {
                const receiverSocketId = userSocketMap.get(participants.caller._id);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('callCancelled', { message: 'The caller has cancelled the call.' });
                }
                console.log(`Call cancelled by ${participants.receiver._id} to ${participants.caller._id}`);
            }
            else {
                console.error("Hangup during initiation data is incomplete");
            }
        }
        catch (error) {
            console.error("Error in hangup during initiation event:", error);
        }
    }));
    socket.on('webrtcSignal', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(data, 'webrtcSignal data');
        if (data.isCaller) {
            if (data.ongoingCall.participants.receiver._id) {
                const emitSocketId = userSocketMap.get(data.ongoingCall.participants.receiver._id);
                io.to(emitSocketId).emit('webrtcSignal', data);
            }
        }
        else {
            if (data.ongoingCall.participants.caller._id) {
                const emitSocketId = userSocketMap.get(data.ongoingCall.participants.caller._id);
                io.to(emitSocketId).emit('webrtcSignal', data);
            }
        }
    }));
    socket.on('hangup', (ongoingCall) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Hangup event received:', ongoingCall);
            const { participants } = ongoingCall;
            if (participants && participants.caller && participants.receiver) {
                const otherParticipantId = socket.id === userSocketMap.get(participants.caller._id)
                    ? participants.receiver._id
                    : participants.caller._id;
                const otherParticipantSocketId = userSocketMap.get(otherParticipantId);
                if (otherParticipantSocketId) {
                    io.to(otherParticipantSocketId).emit('callEnded', { message: 'The other participant has ended the call.' });
                }
                console.log(`Call ended between ${participants.caller._id} and ${participants.receiver._id}`);
            }
            else {
                console.error("Hangup data is incomplete");
            }
        }
        catch (error) {
            console.error("Error in hangup event:", error);
        }
    }));
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// let users: { userId: any; socketId: string }[] = [];
// io.on("connection", (socket: Socket) => {
//   console.log("User connected", socket.id);
//   socket.on("addUser", (userId) => {
//     const isUserExist = users.find((user) => user.userId === userId);
//     if (!isUserExist) {
//       const user = { userId, socketId: socket.id };
//       users.push(user);
//       io.emit("getUsers", users);
//     }
//   });
//   socket.on(
//     "sendMessage",
//     async ({ senderId, receiverId, message,createdAt, conversationId }) => {
//       const receiver = users.find((user) => user.userId === receiverId);
//       const sender = users.find((user) => user.userId === senderId);
//       const user = await UserModel.findById(senderId);
//       console.log("sender :>> ", sender, 'receiver' , receiver);
//       if (receiver) {
//         io.to(receiver.socketId)
//           .to(sender?.socketId)
//           .emit("getMessage", {
//             senderId,
//             message,
//             createdAt,
//             conversationId,
//             receiverId,
//             user: {
//               id: user?._id,
//               fullName: user?.fullname,
//               email: user?.email,
//             },
//           });
//       } else {
//         io.to(sender?.socketId).emit("getMessage", {
//           senderId,
//           message,
//           createdAt,
//           conversationId,
//           receiverId,
//           user: { id: user?._id, fullName: user?.fullname, email: user?.email },
//         });
//       }
//     }
//   );
//   socket.on("disconnect", () => {
//     users = users.filter((user) => user.socketId !== socket.id);
//     io.emit("getUsers", users);
//   });
//   // io.emit('getUsers', socket.userId);
// });
// app.post("/api/conversation", async (req, res) => {
//   try {
//     const { senderId, receiverId } = req.body;
//     const newCoversation = new CoversationModel({
//       members: [senderId, receiverId],
//     });
//     await newCoversation.save();
//     res.status(200).send("Conversation created successfully");
//   } catch (error) {
//     console.log(error, "Error");
//   }
// });
// app.get("/api/conversations/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const objectIdUserId = new mongoose.Types.ObjectId(userId);
//     const conversations = await CoversationModel.find({
//       members: { $in: [userId] },
//     });
//     // console.log('conversations',conversations);
//     const conversationUserData = Promise.all(
//       conversations.map(async (conversation) => {
//         // const receiverId = conversation.members.find((member) => member !== userId);
//         const receiverId = conversation.members.find(
//           (member) => !member.equals(objectIdUserId)
//         );
//         const user = await UserModel.findById(receiverId);
//         return {
//           user: {
//             receiverId: user?._id,
//             email: user?.email,
//             fullName: user?.fullname,
//           },
//           conversationId: conversation._id,
//           createdAt: conversation.createdAt
//         };
//       })
//     );
//     res.status(200).json(await conversationUserData);
//   } catch (error) {
//     console.log(error, "Error");
//   }
// });
// app.post("/api/message", async (req, res) => {
//   try {
//     const { conversationId, senderId, message, receiverId = "" } = req.body;
//     // console.log(req.body);
//     if (!senderId || !message)
//       return res.status(400).send("Please fill all required fieldsss");
//     if (conversationId === "new" && receiverId) {
//       const newCoversation = new CoversationModel({
//         members: [senderId, receiverId],
//       });
//       await newCoversation.save();
//       const newMessage = new ChatModel({
//         conversationId: newCoversation._id,
//         senderId,
//         message,
//       });
//       await newMessage.save();
//       return res.status(200).send("Message sent successfully");
//     } else if (!conversationId && !receiverId) {
//       return res.status(400).send("Please fill all required fields");
//     }
//     const newMessage = new ChatModel({ conversationId, senderId, message });
//     await newMessage.save();
//     res.status(200).send("Message sent successfully");
//   } catch (error) {
//     console.log(error, "Error");
//   }
// });
// app.get("/api/message/:conversationId", async (req, res) => {
//   try {
//     const checkMessages = async (conversationId: any) => {
//       // console.log(conversationId, "conversationId");
//       const messages = await ChatModel.find({ conversationId }).exec();
//       // console.log('messages',messages);
//       const messageUserData = Promise.all(
//         messages.map(async (message) => {
//           const user = await UserModel.findById(message.senderId);
//           return {
//             user: {
//               id: user?._id,
//               email: user?.email,
//               fullName: user?.fullname,
//             },
//             message: message.message,
//             createdAt: message.createdAt , // Include createdAt here
//           };
//         })
//       );
//       res.status(200).json(await messageUserData);
//     };
//     const conversationId = req.params.conversationId;
//     if (conversationId === "new") {
//       const checkConversation = await CoversationModel.find({
//         members: { $all: [req.query.senderId, req.query.receiverId] },
//       });
//       if (checkConversation.length > 0) {
//         checkMessages(checkConversation[0]._id);
//       } else {
//         return res.status(200).json([]);
//       }
//     } else {
//       checkMessages(conversationId);
//     }
//   } catch (error) {
//     console.log("Error", error);
//   }
// });
// app.get("/api/users/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const users = await UserModel.find({ _id: { $ne: userId } , role: "profesional" });
//     const usersData = Promise.all(
//       users.map(async (user) => {
//         return {
//           user: {
//             email: user.email,
//             fullName: user.fullname,
//             receiverId: user._id,
//           },
//         };
//       })
//     );
//     res.status(200).json(await usersData);
//   } catch (error) {
//     console.log("Error", error);
//   }
// });
const port = process.env.PORT || 3005;
server.listen(port, () => {
    console.log("server is running...");
});
// install for typescript
// npm install --save-dev @types/yup
