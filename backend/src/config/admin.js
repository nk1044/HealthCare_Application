// import 'dotenv/config';
// import AdminJS from 'adminjs'
// import AdminJSExpress from '@adminjs/express'
// import * as AdminJSMongoose from '@adminjs/mongoose'
// import MongoStore from 'connect-mongo';
// import mongoose from 'mongoose';
// import { User } from '../models/user.model.js';
// import { Queue } from '../models/queue.model.js';
// import { FeaturedServices, PartnerClinic, Specialist } from '../models/DashBoard.model.js';
// import { AboutPageTeam } from '../models/About.model.js';
// import { Service } from '../models/Service.model.js';
// import express from 'express';
// import bodyParser from 'body-parser';


// const DEFAULT_ADMIN = {
//     email: process.env.ADMIN_EMAIL || 'admin@example.com',
//     password: process.env.ADMIN_PASSWORD || 'password',
// };

// const authenticate = async (email, password) => {
//     if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
//         return Promise.resolve(DEFAULT_ADMIN);
//     }
//     return null;
// };

// AdminJS.registerAdapter({
//     Resource: AdminJSMongoose.Resource,
//     Database: AdminJSMongoose.Database,
// });

// const adminOptions = {
//     resources: [
//         User,
//         Queue,
//         FeaturedServices,
//         Specialist,
//         PartnerClinic,
//         AboutPageTeam,
//         Service
//     ],
//     rootPath: '/admin',
//     branding: {
//         companyName: 'Health Care',
//         logo: false,
//     },
// };

// export const startAdmin = async (app) => {
//     if (!mongoose.connection.readyState) {
//         throw new Error("MongoDB is not connected!");
//     }

//     const admin = new AdminJS(adminOptions);
    
//     const sessionStore = MongoStore.create({
//         mongoUrl: process.env.MONGODB_URI,
//         collectionName: 'sessions',
//         ttl: 14 * 24 * 60 * 60,
//     });

//     const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
//         admin,
//         {
//             authenticate,
//             cookieName: 'adminjs',
//             cookiePassword: process.env.COOKIE_SECRET || 'sessionsecret',
//         },
//         null,
//         {
//             store: sessionStore,
//             resave: false,
//             saveUninitialized: false,
//             secret: process.env.REFRESH_TOKEN_SECRET || 'sessionsecret',
//             cookie: {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 maxAge: 14 * 24 * 60 * 60 * 1000,
//             },
//             name: 'adminjs',
//         }
//     );
//     console.log(admin.options.rootPath);
    
//     app.use(admin.options.rootPath, adminRouter);
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: true }));
//     app.use(bodyParser.json());

//     return { admin, adminRouter };
// }


