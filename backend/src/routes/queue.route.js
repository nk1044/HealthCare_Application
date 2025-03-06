import { Router } from "express";
import {AddEntryToQueue, getQueueByUser} from '../controllers/queue.controller.js';
import {VerifyToken} from '../middlewares/auth.middleware.js';

const router = Router();


router.route('/add-entry-to-queue').post(VerifyToken, AddEntryToQueue);
router.route('/get-user-queue/:userId').get(VerifyToken,getQueueByUser)

export default router;