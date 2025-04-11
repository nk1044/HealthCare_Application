import {Schema, model} from 'mongoose';

const chatSchema = new Schema({
    tag: {
        type: String,
        required: true,
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        default: 'No description provided',
    },
    chat: {
        type: [{
            sender: { type: String, required: true },
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }],
        default: []
    }

}, {timestamps: true});

export const Chat = model('Chat', chatSchema);