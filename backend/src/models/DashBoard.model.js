import mongoose, { Schema, model } from 'mongoose';

const featuredServicesSchema = new Schema({
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

const specialistSchema = new Schema({
    name: {
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

const partnerClinicSchema = new Schema({
    name: {
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

export const FeaturedServices = model('FeaturedServices', featuredServicesSchema);
export const Specialist = model('Specialist', specialistSchema);
export const PartnerClinic = model('PartnerClinic', partnerClinicSchema);
