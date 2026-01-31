import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Bookmarking routes
router.post('/:id/bookmark', authenticateToken, userController.addBookmark);
router.delete('/:id/bookmark', authenticateToken, userController.removeBookmark);

export default router;
