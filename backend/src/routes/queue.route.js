import { Router } from "express";
import {AddEntryToQueue,getQueueByUser,RemoveEntryFromQueue} from '../controllers/queue.controller.js';
import {VerifyToken} from '../middlewares/auth.middleware.js';

const router = Router();


router.route('/add-entry-to-queue').post(VerifyToken, AddEntryToQueue);
router.route('/get-user-queue/:userId').get(VerifyToken,getQueueByUser)
router.route('/delete-entry-from-queue').post(VerifyToken, RemoveEntryFromQueue);

export default router;