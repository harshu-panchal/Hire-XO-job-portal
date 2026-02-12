import { Router } from 'express';
import { PromotionPlanController } from '../controllers/promotion-plan.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();
const promotionPlanController = new PromotionPlanController();

// Public route - Get all active promotion plans
router.get('/plans', promotionPlanController.getAllPlans);

// Admin routes - Protected
router.post('/admin/plans', authenticateToken, requireAdmin, promotionPlanController.createPlan);
router.put('/admin/plans/:id', authenticateToken, requireAdmin, promotionPlanController.updatePlan);
router.delete('/admin/plans/:id', authenticateToken, requireAdmin, promotionPlanController.deletePlan);

export default router;
