import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true // Remove unknown fields
        });

        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            res.status(400).json({
                message: errorMessage,
                code: 'VALIDATION_ERROR',
                details: error.details
            });
            return;
        }

        // Replace req.body with validated/sanitized value
        req.body = value;
        next();
    };
};
