import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { uploadProfilePhoto } from '../middlewares/upload.middleware';


const router = Router();
const userController = new UserController();

// All user routes are protected
router.get('/stats', authenticateToken, userController.getDashboardStats);
router.patch('/profile-photo', authenticateToken, uploadProfilePhoto, userController.updateProfilePhoto);

export default router;

