import { Router } from 'express';
import { ResourceFactoryController } from '../controllers/resource-factory.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

import Joi from 'joi';
import { validate } from '../middlewares/validation.middleware';

export const createResourceRouter = (
    controller: ResourceFactoryController<any>,
    schema?: Joi.ObjectSchema,
    updateSchema?: Joi.ObjectSchema
) => {
    const router = Router();

    // Public Routes
    router.get('/', controller.getAll);

    // Protected Routes (Require Authentication)
    // IMPORTANT: Specific routes must come BEFORE parameterized routes
    router.get('/my-listings', authenticateToken, controller.getMyListings);

    // Apply validation if schema is provided
    if (schema) {
        router.post('/', authenticateToken, validate(schema), controller.create);
    } else {
        router.post('/', authenticateToken, controller.create);
    }

    // Parameterized routes (must be last)
    router.get('/:id', controller.getById);

    // Apply update validation if schema is provided
    if (updateSchema) {
        router.put('/:id', authenticateToken, validate(updateSchema), controller.update);
    } else {
        router.put('/:id', authenticateToken, controller.update);
    }

    router.delete('/:id', authenticateToken, controller.delete);

    return router;
};
