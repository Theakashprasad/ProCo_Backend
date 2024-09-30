import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/dbConfig";
import UserRoutes from "./router/userRouter";
import ProRoutes from "./router/proRouter";
import ChatRoutes from "./router/chatrouter";
import AdminRoutes from "./router/adminRouter";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

dotenv.config();
connectDb();

const app = express();
const corsOptions = {
  origin: ['https://www.proco.life', 'https://proco.life', 'http://localhost:3000'], // Specify allowed origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Allow credentials
};
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://proco.life'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
    }
});

app.use(cors(corsOptions)); // Use CORS middleware with options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/", UserRoutes); 
app.use("/api/pro/", ProRoutes);
app.use("/api/chat/", ChatRoutes);
app.use("/api/admin/", AdminRoutes);
app.get("/", (req, res) => {
  res.send("hy");
});


// CHAT
const userSocketMap = new Map();

io.on('connection', (socket) => {
  socket.on('user_connected', (userId) => {
    console.log('User connected:', userId);
    userSocketMap.set(userId, socket.id);
  });

  socket.on('join chat', async (chatData) => {
    try {
      const { chatId} = chatData;
      if (chatId) {
        socket.join(`chat_${chatId}`);
        console.log(`User joined chat ${chatId}`);
      } else {
        console.error("Chat ID is missing");
      }
    } catch (error) {
      console.error("Error in join chat:", error);
    }
  });

  socket.on('chat message', async (messageData) => {
    try {
      console.log('chat message', messageData);
      const { chatId, senderId, receiverId, messageText, createdAt } = messageData;
      if (chatId && senderId && receiverId && messageText && createdAt) {
        const receiverSocketId = userSocketMap.get(receiverId);
          io.to(receiverSocketId).emit('chat message', { chatId, senderId, messageText ,createdAt});
      } else {
        console.error("Message data is incomplete");
      }
    } catch (error) {
      console.error("Error in chat message:", error);
    }
  });


//WEB RTC
  socket.on('call', async (participants) => {
    try {
      const { caller, receiver} = participants;
      console.log(participants,  'call');
      if (participants) { 
        console.log('incomingCall')
        const receiverSocketId = userSocketMap.get(receiver._id);
        console.log(receiverSocketId,'sp')
        io.to(receiverSocketId).emit('incomingCall', {caller,receiver });
      } else {
        console.error("Call data is incomplete"); 
      }   
    } catch (error) {
      console.error("Error in calling:", error);
    }
  });


  socket.on('hangupDuringInitiation', async (ongoingCall) => {
    try {
      console.log('Hangup during initiation event received:', ongoingCall);
      const { participants } = ongoingCall;
      
      if (participants && participants.caller && participants.receiver) {
        const receiverSocketId = userSocketMap.get(participants.caller._id);
        
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('callCancelled', { message: 'The caller has cancelled the call.' });
        }
        console.log(`Call cancelled by ${participants.receiver._id} to ${participants.caller._id}`);
      } else {
        console.error("Hangup during initiation data is incomplete");
      }
    } catch (error) {
      console.error("Error in hangup during initiation event:", error);
    }
  });

  socket.on('webrtcSignal', async (data) => {
    console.log(data,'webrtcSignal data')
    if(data.isCaller){
      if(data.ongoingCall.participants.receiver._id){
        const emitSocketId = userSocketMap.get(data.ongoingCall.participants.receiver._id);
        io.to(emitSocketId).emit('webrtcSignal',data)
      }
    }else{
      if(data.ongoingCall.participants.caller._id){
        const emitSocketId = userSocketMap.get(data.ongoingCall.participants.caller._id);
        io.to(emitSocketId).emit('webrtcSignal',data)
      }
    }
  });

  socket.on('hangup', async (ongoingCall) => {
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
      } else {
        console.error("Hangup data is incomplete");
      }
    } catch (error) {
      console.error("Error in hangup event:", error);
    }
  });


  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


const port = process.env.PORT || 3005;
server.listen(port, () => {
  console.log("server is running...");
});

// install for typescript
// npm install --save-dev @types/yup
