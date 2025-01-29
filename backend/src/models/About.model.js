import mongoose, { Schema, model } from 'mongoose';

const aboutPageTeamSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    position: {
        type: String,
        required: true,
        maxlength: 100
    },
    image_url: {
        type: String,
        required: true,
        maxlength: 500
    }
}, { timestamps: true });

export const AboutPageTeam = model('AboutPageTeam', aboutPageTeamSchema);