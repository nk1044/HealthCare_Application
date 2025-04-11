import {Schema, model} from 'mongoose';
import {User} from './User.model.js';

const chatSchema = new Schema({

}, {timestamps: true});

const Chat = model('Chat', chatSchema);