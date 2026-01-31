import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const subscriptionController = new SubscriptionController();

// Public route - anyone can view plans
router.get('/plans', subscriptionController.getAllPlans);

// Protected routes
router.get('/wallet/balance', authenticateToken, subscriptionController.getWalletBalance);
router.post('/wallet/recharge', authenticateToken, subscriptionController.rechargeWallet);
router.post('/purchase', authenticateToken, subscriptionController.purchaseSubscription);
router.get('/status', authenticateToken, subscriptionController.checkSubscriptionStatus);

export default router;
