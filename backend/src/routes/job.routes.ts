import { Router } from 'express';
import { jobController } from '../controllers/job.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Public Routes
router.get('/', jobController.getAll);

// Protected Routes - Must come BEFORE parameterized routes
router.get('/my-listings', authenticateToken, jobController.getMyListings);
router.post('/', authenticateToken, requireRole('recruiter'), jobController.create);

// Parameterized routes (must be last)
router.get('/:id', jobController.getById);
router.put('/:id', authenticateToken, jobController.update);
router.delete('/:id', authenticateToken, jobController.delete);

export default router;
