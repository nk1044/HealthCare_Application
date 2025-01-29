import {Service} from '../models/Service.model.js';

export const GetServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}