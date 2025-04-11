import {Schema, model} from 'mongoose';
import {User} from './user.model.js';

const chatSchema = new Schema({

}, {timestamps: true});

const Chat = model('Chat', chatSchema);