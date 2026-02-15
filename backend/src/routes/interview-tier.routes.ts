import { Router } from 'express';
import { InterviewTierController } from '../controllers/interview-tier.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();
const controller = new InterviewTierController();

// Public + employee APIs
router.get('/', controller.getPublicTiers);
router.post('/purchase', authenticateToken, requireRole('employee', 'job-seeker'), controller.purchaseTier);

// Admin APIs
router.get('/admin', authenticateToken, requireRole('admin'), controller.getAdminTiers);
router.post('/admin/bootstrap', authenticateToken, requireRole('admin'), controller.bootstrapAdminTiers);
router.post('/admin', authenticateToken, requireRole('admin'), controller.createAdminTier);
router.put('/admin/:id', authenticateToken, requireRole('admin'), controller.updateAdminTier);
router.delete('/admin/:id', authenticateToken, requireRole('admin'), controller.deleteAdminTier);

export default router;
