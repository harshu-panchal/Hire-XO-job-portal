import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

import { validate } from '../middlewares/validation.middleware';
import { topUpSchema } from '../validations/wallet.validation';

const router = Router();
const walletController = new WalletController();

router.get('/', authenticateToken, walletController.getWallet);
router.get('/transactions', authenticateToken, walletController.getTransactions);
router.post('/top-up', authenticateToken, validate(topUpSchema), walletController.topUp);

export default router;
