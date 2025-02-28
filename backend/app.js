import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './src/routes/auth.route.js';
import queueRouter from './src/routes/queue.route.js';
import homeRouter from './src/routes/web.route.js';

import { Server } from "socket.io";
import http from 'http';
import { getQueueData } from './src/controllers/queue.controller.js';
import bodyParser from 'body-parser';


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


// Sockets
io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    socket.on('disconnect', (reason) => {
        console.log('User disconnected:', reason, socket.id);
    });

    socket.on("join-queue-room", async () => {
        socket.join(String(process.env.ROOM_ID));
        console.log("room id", String(process.env.ROOM_ID));
        
        console.log("User Joined Room");
        socket.to(String(process.env.ROOM_ID)).emit('doctor-connected', 'A new doctor connected');
        const queue = await getQueueData();
        io.to(String(process.env.ROOM_ID)).emit('queue-data', queue);
    });

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
        
        // Notify others in the room about this new connection
        socket.to(roomId).emit('user-connected', { userId });
    });

    socket.on('send-message', (data) => {
        const { roomId, userId, message } = data;
        if (!roomId || !userId || !message) {
            console.error('Invalid message data:', data);
            return;
        }
        console.log(`Message from ${userId} in room ${roomId}: ${message}`);
        socket.to(roomId).emit('receive-message', { userId, message });
    });

    socket.on("offer", ({ roomId, offer }) => {
        socket.to(roomId).emit("offer", { offer });
    });

    socket.on("answer", ({ roomId, answer }) => {
        socket.to(roomId).emit("answer", { answer });
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
        socket.to(roomId).emit("ice-candidate", { candidate });
    });

    socket.on('leave-room', ({ roomId, userId }) => {
        console.log(`User ${userId} leaving room ${roomId}`);
        socket.leave(roomId);
        socket.to(roomId).emit('user-disconnected', { userId });
    });

    socket.on('send-stream', (data) => {
        const { roomId, userId, stream } = data;
        if (!roomId || !userId || !stream) {
            console.error('Invalid data received for sending stream:', data);
            return;
        }
        socket.to(roomId).emit('receive-stream', { userId, stream });
    });
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Your existing routes
app.use('/api/users', authRouter);
app.use('/api/queue', queueRouter);
app.use('/api/home', homeRouter);

export default app;