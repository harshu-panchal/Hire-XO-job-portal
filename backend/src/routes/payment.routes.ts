import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const paymentController = new PaymentController();

router.post('/subscribe', authenticateToken, paymentController.subscribe);
router.post('/webhook', paymentController.webhook);
router.post('/certificate-request', authenticateToken, paymentController.createCertificateRequestImmediate);

export default router;
