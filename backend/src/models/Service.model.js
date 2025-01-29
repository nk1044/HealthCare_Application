import mongoose, { Schema, model } from 'mongoose';

const serviceSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    image_url: {
        type: String,
        required: true,
        maxlength: 500
    }
}, { timestamps: true });

export const Service = model('Service', serviceSchema);