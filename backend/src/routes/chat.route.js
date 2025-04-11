import {getUserChats, deleteChat} from '../controllers/chat.controller.js';
import express from 'express';
import { VerifyToken } from '../middlewares/auth.middleware.js';
import e from 'express';


const router = express.Router();

// get user chat
router.route('/getUserChats').get(VerifyToken, getUserChats);
router.route('/deleteChat').delete(VerifyToken, deleteChat);

export default router;