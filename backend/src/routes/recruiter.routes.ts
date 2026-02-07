import { Router } from 'express';
import { RecruiterController } from '../controllers/recruiter.controller';
import { authenticateToken, checkSubscription } from '../middlewares/auth.middleware';

const router = Router();
const recruiterController = new RecruiterController();

// Only subscribers can view/update profile with advanced features (example usage)
router.get('/profile', authenticateToken, checkSubscription, recruiterController.getProfile);
router.put('/profile', authenticateToken, checkSubscription, recruiterController.updateProfile);

export default router;
