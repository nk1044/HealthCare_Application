import {FeaturedServices, Specialist, PartnerClinic} from '../models/DashBoard.model.js';


const GetDashboardData = async (req, res) => {
    try {
        const featured_services = await FeaturedServices.find();
        const specialists = await Specialist.find();
        const partner_clinics = await PartnerClinic.find();
        res
        .status(200)
        .json({ 
            featured_services: featured_services, 
            specialists: specialists, 
            partner_clinics: partner_clinics, 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {GetDashboardData};