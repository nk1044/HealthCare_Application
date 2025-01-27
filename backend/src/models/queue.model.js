import mongoose, {Schema, model} from 'mongoose';

const queueSchema = new Schema({
    tag:{
        type: String,
        default: 'ENT',
        enum: ['Dentist', 'ENT', 'General'],
    },
    users:{
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }
}, {timestamps: true});

export const Queue = model('Queue', queueSchema);