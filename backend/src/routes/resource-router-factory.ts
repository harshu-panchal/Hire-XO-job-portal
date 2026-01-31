import { Router } from 'express';
import { ResourceFactoryController } from '../controllers/resource-factory.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

export const createResourceRouter = (controller: ResourceFactoryController<any>) => {
    const router = Router();

    // Public Routes
    router.get('/', controller.getAll);

    // Protected Routes (Require Authentication)
    // IMPORTANT: Specific routes must come BEFORE parameterized routes
    router.get('/my-listings', authenticateToken, controller.getMyListings);
    router.post('/', authenticateToken, controller.create);

    // Parameterized routes (must be last)
    router.get('/:id', controller.getById);
    router.put('/:id', authenticateToken, controller.update);
    router.delete('/:id', authenticateToken, controller.delete);

    return router;
};
