import { Router } from "express";
import {AddEntryToQueue} from '../controllers/queue.controller.js';
import {VerifyToken} from '../middlewares/auth.middleware.js';

const router = Router();


router.route('/add-entry-to-queue').post(VerifyToken, AddEntryToQueue);

export default router;