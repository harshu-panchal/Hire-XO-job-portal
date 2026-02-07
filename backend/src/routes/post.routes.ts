import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { authenticateToken, optionalAuthenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createPostSchema } from '../validations/post.validation';

const router = Router();
const postController = new PostController();

// Use optionalAuthenticate for getAll so guest users can see community posts, 
// but auth info (like ID) is available for subscription checks
router.get('/', optionalAuthenticate, postController.getAll);

// Protected routes
router.post('/', authenticateToken, validate(createPostSchema), postController.create);
router.post('/:id/like', authenticateToken, postController.like);
router.delete('/:id', authenticateToken, postController.delete);

export default router;
