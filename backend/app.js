import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './src/routes/auth.route.js';
import queueRouter from './src/routes/queue.route.js';
import homeRouter from './src/routes/web.route.js';
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import * as AdminJSMongoose from '@adminjs/mongoose'
import { User } from './src/models/user.model.js';
import { Queue } from './src/models/queue.model.js';
import {FeaturedServices, Specialist, PartnerClinic} from './src/models/DashBoard.model.js';
import {AboutPageTeam} from './src/models/About.model.js';
import {Service} from './src/models/Service.model.js';

import { Server } from "socket.io";
import http from 'http';
import { getQueueData } from './src/controllers/queue.controller.js';


AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
})

const adminOptions = {
    resources: [
        User, Queue, 
        FeaturedServices, Specialist, PartnerClinic,
        AboutPageTeam,
        Service
    ],
}

const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",  // Allow your frontend
        credentials: true
    }
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

const admin = new AdminJS(adminOptions)
const adminRouter = AdminJSExpress.buildRouter(admin)
app.use(admin.options.rootPath, adminRouter)





app.use('/api/users', authRouter);
app.use('/api/queue', queueRouter);
app.use('/api/home', homeRouter);



// Sockets

io.on("connection",(socket)=>{
    console.log("User Connected", socket.id);
    socket.on("join-queue-room", async()=>{
        socket.join(String(process.env.ROOM_ID));
        console.log("User Joined Room");
        socket.to(String(process.env.ROOM_ID)).emit('doctor-connected', 'A new doctor connected');
        const queue = await getQueueData();
        io.to(String(process.env.ROOM_ID)).emit('queue-data', queue);
    })
})

export default app;
