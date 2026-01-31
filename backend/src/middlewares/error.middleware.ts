import { Request, Response, NextFunction } from 'express';

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

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((val: any) => val.message).join(', ');
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

    res.status(statusCode).json({
        success: false,
        message,
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
