import {Router} from 'express';
import {GetDashboardData} from '../controllers/dashboard.controller.js';
import {GetAboutPageTeam} from '../controllers/about.controller.js';
import {GetServices} from '../controllers/service.controller.js';

const router = Router();

router.route('/dashboard').get(GetDashboardData);
router.route('/about').get(GetAboutPageTeam);
router.route('/services').get(GetServices);


export default router;