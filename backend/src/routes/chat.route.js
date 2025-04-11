import {getUserChats, deleteChat} from '../controllers/chat.controller.js';
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import e from 'express';


const router = express.Router();

// get user chat
router.route('/getUserChats').get(verifyToken, getUserChats);
router.route('/deleteChat').delete(verifyToken, deleteChat);

export default router;