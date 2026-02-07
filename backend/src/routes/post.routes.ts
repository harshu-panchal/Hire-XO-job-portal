import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { authenticateToken, optionalAuthenticate } from '../middlewares/auth.middleware';

const router = Router();
const postController = new PostController();

// Use optionalAuthenticate for getAll so guest users can see community posts, 
// but auth info (like ID) is available for subscription checks
router.get('/', optionalAuthenticate, postController.getAll);

// Protected routes
router.post('/', authenticateToken, postController.create);
router.post('/:id/like', authenticateToken, postController.like);
router.post('/:id/comments', authenticateToken, postController.addComment);
router.delete('/:id', authenticateToken, postController.delete);

export default router;
