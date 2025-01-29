import {AboutPageTeam} from '../models/About.model.js';

export const GetAboutPageTeam = async (req, res) => {
    try {
        const team = await AboutPageTeam.find();
        res.status(200).json(team);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}