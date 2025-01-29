import { Router } from "express";
import {AddEntryToQueue, GetQueue} from '../controllers/queue.controller.js';
import {VerifyToken} from '../middlewares/auth.middleware.js';

const router = Router();


router.route('/add-entry-to-queue').post(VerifyToken, AddEntryToQueue);
router.route('/get-queue').get(VerifyToken, GetQueue);

export default router;