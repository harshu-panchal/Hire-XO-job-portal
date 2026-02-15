import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { uploadApplication } from '../middlewares/upload.middleware';

const router = Router();
const applicationController = new ApplicationController();

// All routes require authentication
router.post('/jobs/:jobId/apply', authenticateToken, uploadApplication, applicationController.applyToJob);
router.post('/resources/:resourceType/:resourceId/apply', authenticateToken, uploadApplication, applicationController.applyToResource);
router.get('/my-applications', authenticateToken, applicationController.getMyApplications);
router.get('/received', authenticateToken, applicationController.getReceivedApplications);
router.get('/jobs/:jobId/applications', authenticateToken, applicationController.getJobApplications);
router.get('/resources/:resourceType/:resourceId/applications', authenticateToken, applicationController.getResourceApplications);
router.get('/resources/received', authenticateToken, applicationController.getReceivedResourceApplications);
router.get('/admin/sla-expired', authenticateToken, requireRole('admin'), applicationController.getSLAExpiredApplications);
router.put('/:applicationId/status', authenticateToken, applicationController.updateApplicationStatus);
router.delete('/:applicationId', authenticateToken, applicationController.deleteApplication);

export default router;
