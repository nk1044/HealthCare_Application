import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './src/routes/auth.route.js';
import queueRouter from './src/routes/queue.route.js';
import homeRouter from './src/routes/web.route.js';
import chatRouter from './src/routes/chat.route.js';
import { userOnline } from './src/config/userOnline.js';

import { Server } from "socket.io";
import http from 'http';
import { getChatMessages, getQueueData, addChatMessage } from './src/controllers/queue.controller.js';
import bodyParser from 'body-parser';

import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSMongoose from '@adminjs/mongoose'
import { Queue } from './src/models/queue.model.js';
import { User } from './src/models/user.model.js';
import { Chat } from './src/models/Chat.model.js';



AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
})

const adminOptions = {
    resources: [
        Queue,User,Chat
    ],
}

const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

// Basic middleware
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

const admin = new AdminJS(adminOptions)
const adminRouter = AdminJSExpress.buildRouter(admin)
app.use(admin.options.rootPath, adminRouter)

// Sockets
io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    socket.on('user-joined', async ({ userId, role }) => {
        // console.log("User joined", userId, role);
        if (!userId) {
            console.error('Invalid userId received:', userId);
            return;
        }

        // Only update if socketId is different
        if (role == 'Patient') {
            const existingSocket = await userOnline.getSocketIdByUserId(userId);
            if (existingSocket !== socket.id) {
                await userOnline.addUser(userId, socket.id);
            }
        }
        const queue = await getQueueData();
        io.to(String(process.env.ROOM_ID)).emit('queue-data', queue);
    });


    socket.on('disconnect', async () => {
        // Find and remove user from onlineUsers
        await userOnline.removeUserBySocketId(socket.id);
        console.log("User Disconnected", socket.id);
        console.log("online users (disconected)", await userOnline.getOnlineUsers());

    });

    socket.on('leave-chat-room', async (roomId) => {
        socket.leave(roomId);
        console.log('User left room:', roomId);
        await userOnline.removeUserBySocketId(socket.id);
        console.log("User Disconnected", socket.id);
        const queue = await getQueueData();
        io.to(String(process.env.ROOM_ID)).emit('queue-data', queue);
    })

    socket.on('join-chat-room', async (roomId) => {
        if (!roomId) {
            console.error('Invalid data received for joining room:', roomId);
            return;
        }
        socket.join(String(roomId));
        console.log("room id for chat room", String(roomId));
        const chat = await getChatMessages(roomId);
        io.to(String(roomId)).emit('chat-history', chat);
    });

    socket.on("send-chat-message", async (data) => {
        const { roomId, newChat } = data;
        if (!roomId || !newChat) {
            console.error('Invalid data received for sending message:', data);
            return;
        }
        await addChatMessage(roomId, newChat);
        console.log("message", newChat);
        const chat = await getChatMessages(roomId);
        io.to(String(roomId)).emit('chat-history', chat);
    }
    );


    // DND->OPD page one socket is also in queue controller
    socket.on("join-queue-room", async () => {
        const roomId = process.env.ROOM_ID;
        socket.join(String(process.env.ROOM_ID));
        console.log("room id", String(process.env.ROOM_ID));

        console.log("User Joined Room");
        socket.to(String(roomId)).emit('doctor-connected', 'A new doctor connected');
        const queue = await getQueueData();
        io.to(String(roomId)).emit('queue-data', queue);
    });

    //DND->BELOW function are for video call 👇
    socket.on('join-room', (data) => {
        const roomId = data?.roomId;
        const userId = data?.userId;

        if (!roomId || !userId) {
            console.error('Invalid data received for joining room:', data);
            return;
        }

        console.log(`User ${userId} joined room: ${roomId}`);

        // Join the room
        socket.join(roomId);

        // Check room size and notify other users in the room
        const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
        console.log(`Room ${roomId} now has ${roomSize} participants`);
        socket.to(roomId).emit('user-connected', { userId });
    });

    socket.on("leave-room", ({ roomId, userId }) => {
        socket.to(roomId).emit("user-disconnected", { userId });
        socket.leave(roomId);
    });

    // DND
    socket.on("offer", ({ roomId, offer }) => {
        socket.to(roomId).emit("offer", { offer });
    });

    // DND
    socket.on("answer", ({ roomId, answer }) => {
        socket.to(roomId).emit("answer", { answer });
    });

    // DND
    socket.on("ice-candidate", ({ roomId, candidate }) => {
        socket.to(roomId).emit("ice-candidate", { candidate });
    });

});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Your existing routes
app.use('/api/users', authRouter);
app.use('/api/queue', queueRouter);
app.use('/api/home', homeRouter);
app.use('/api/chat', chatRouter);

export default app;