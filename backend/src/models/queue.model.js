import mongoose, {Schema, model} from 'mongoose';

const queueSchema = new Schema({
    tag:{
        type: String,
        default: 'ENT',
        enum: ['Dentist', 'ENT', 'General'],
    },
    Entries:{
        type: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            tag: {
                type: String,
                default: 'ENT',
                enum: ['Dentist', 'ENT', 'General'],
            },
            description: {
                type: String,
                default: 'No description provided',
            },
            roomID:{
                type:Number,
            }
        }],
        default: []
    }
}, {timestamps: true});

export const Queue = model('Queue', queueSchema);