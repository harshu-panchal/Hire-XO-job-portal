import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

/**
 * Global Error Handling Middleware
 * Standardizes error responses across the API.
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle custom AppError instances (BadRequestError, UnauthorizedError, etc.)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Handle Multer upload validation errors from fileFilter
    if (err.isUploadValidationError) {
        statusCode = 400;
        message = err.message || 'Invalid upload';

        const errors = [
            {
                field: 'file',
                message
            }
        ];

        if (process.env.NODE_ENV !== 'test') {
            console.error(`[Error] ${statusCode} - ${message}`);
        }

        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';

        // Transform Mongoose validation errors to standard format
        const errors = Object.keys(err.errors).map(field => ({
            field,
            message: err.errors[field].message
        }));

        // Log the error for developers
        if (process.env.NODE_ENV !== 'test') {
            console.error(`[Error] ${statusCode} - ${message}`);
        }

        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }

    // Handle Mongoose CastError (Invalid ID)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle JWT Errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your token has expired. Please log in again.';
    }

    // Log the error for developers (but not the full stack in production)
    if (process.env.NODE_ENV !== 'test') {
        console.error(`[Error] ${statusCode} - ${message}`);
        if (statusCode === 500) {
            console.error(err.stack);
        }
    }

    // Return standardized error format
    res.status(statusCode).json({
        success: false,
        message,
        errors: [] // Empty array for non-validation errors
    });
};
