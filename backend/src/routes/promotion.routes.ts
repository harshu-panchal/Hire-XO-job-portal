import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();
const promotionController = new PromotionController();

router.post('/', authenticateToken, requireRole('employer', 'recruiter'), promotionController.createPromotion);
router.get('/my-promotions', authenticateToken, requireRole('employer', 'recruiter'), promotionController.getMyPromotions);

export default router;
