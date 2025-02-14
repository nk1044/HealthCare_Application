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
import { startAdmin } from './src/config/admin.js';



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
    socket.on("join-queue-room", async () => {
        socket.join(String(process.env.ROOM_ID));
        console.log("User Joined Room");
        socket.to(String(process.env.ROOM_ID)).emit('doctor-connected', 'A new doctor connected');
        const queue = await getQueueData();
        io.to(String(process.env.ROOM_ID)).emit('queue-data', queue);
    })
});





// Your existing routes
app.use('/api/users', authRouter);
app.use('/api/queue', queueRouter);
app.use('/api/home', homeRouter);

export default app;