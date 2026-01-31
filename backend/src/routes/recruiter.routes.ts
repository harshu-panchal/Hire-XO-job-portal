import { Router } from 'express';
import { RecruiterController } from '../controllers/recruiter.controller';

const router = Router();
const recruiterController = new RecruiterController();

router.get('/profile', recruiterController.getProfile);
router.put('/profile', recruiterController.updateProfile);

export default router;
