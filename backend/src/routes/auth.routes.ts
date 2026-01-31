import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/password', authenticateToken, authController.changePassword);
router.post('/logout', authenticateToken, authController.logout);

export default router;
