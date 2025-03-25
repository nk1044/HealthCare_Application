import mongoose, { Schema, model } from 'mongoose';

const queueSchema = new Schema({
    tag: {
        type: String,
        enum: ['Dentist', 'ENT', 'General'],
        default: 'ENT'
    },
    Entries: {
        type: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            tag: {
                type: String,
                enum: ['Dentist', 'ENT', 'General'],
                default: 'ENT'
            },
            description: {
                type: String,
                default: 'No description provided',
            },
            roomID: {
                type: Number,
                required: true
            },
            chat: {
                type: [{
                    sender: { type: String, required: true },
                    message: { type: String, required: true },
                    timestamp: { type: Date, default: Date.now }
                }],
                default: []
            }
        }],
        default: []
    }
}, { timestamps: true });

export const Queue = model('Queue', queueSchema);
