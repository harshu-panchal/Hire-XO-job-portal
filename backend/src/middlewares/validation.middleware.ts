import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true // Remove unknown fields
        });

        if (error) {
            // Transform Joi errors to standard format: { message, errors: [{field, message}] }
            const errors = error.details.map((detail: any) => ({
                field: detail.path.join('.'), // e.g., "email" or "salary.min"
                message: detail.message.replace(/"/g, '') // Remove quotes from Joi messages
            }));

            res.status(400).json({
                message: 'Validation failed',
                errors
            });
            return;
        }

        // Replace req.body with validated/sanitized value
        req.body = value;
        next();
    };
};
