import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const applicationController = new ApplicationController();

// All routes require authentication
router.post('/jobs/:jobId/apply', authenticateToken, applicationController.applyToJob);
router.post('/resources/:resourceType/:resourceId/apply', authenticateToken, applicationController.applyToResource);
router.get('/my-applications', authenticateToken, applicationController.getMyApplications);
router.get('/jobs/:jobId/applications', authenticateToken, applicationController.getJobApplications);
router.get('/resources/:resourceType/:resourceId/applications', authenticateToken, applicationController.getResourceApplications);
router.put('/:applicationId/status', authenticateToken, applicationController.updateApplicationStatus);

export default router;
