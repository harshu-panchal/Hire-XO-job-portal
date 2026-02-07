import { Router } from 'express';
import { uploadMultiple } from '../middlewares/upload.middleware';
import { validate } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', validate(loginSchema), authController.login);
router.post('/signup', uploadMultiple, validate(registerSchema), authController.signup);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/password', authenticateToken, authController.changePassword);
router.post('/logout', authenticateToken, authController.logout);

export default router;
