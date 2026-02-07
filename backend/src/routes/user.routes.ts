import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { uploadProfilePhoto } from '../middlewares/upload.middleware';


const router = Router();
const userController = new UserController();

// All user routes are protected
router.get('/stats', authenticateToken, userController.getDashboardStats);
router.patch('/profile-photo', authenticateToken, uploadProfilePhoto, userController.updateProfilePhoto);
router.patch('/profile', authenticateToken, userController.updateProfile);

// Bookmark routes
router.post('/bookmarks/:id', authenticateToken, userController.addBookmark);
router.delete('/bookmarks/:id', authenticateToken, userController.removeBookmark);

export default router;

