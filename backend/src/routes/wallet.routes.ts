import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const walletController = new WalletController();

router.get('/', authenticateToken, walletController.getWallet);
router.post('/top-up', authenticateToken, walletController.topUp);

export default router;
