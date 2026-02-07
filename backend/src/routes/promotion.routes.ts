import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const promotionController = new PromotionController();

router.post('/', authenticateToken, promotionController.createPromotion);
router.get('/my-promotions', authenticateToken, promotionController.getMyPromotions);

export default router;
