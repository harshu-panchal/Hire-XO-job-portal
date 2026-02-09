/**
 * Custom Error Classes with HTTP Status Codes
 * 
 * These error classes allow the service layer to throw meaningful errors
 * with proper HTTP status codes, which the error middleware can then handle.
 * 
 * Usage:
 *   throw new BadRequestError('Invalid input data');
 *   throw new UnauthorizedError('Invalid credentials');
 *   throw new NotFoundError('User not found');
 *   throw new ConflictError('Email already exists');
 */

/**
 * Base Application Error
 * All custom errors extend from this class
 */
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Distinguishes operational errors from programming errors

        // Maintains proper stack trace for where error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 400 Bad Request
 * Use for invalid input data, malformed requests
 */
export class BadRequestError extends AppError {
    constructor(message: string = 'Bad Request') {
        super(message, 400);
    }
}

/**
 * 401 Unauthorized
 * Use for authentication failures (invalid credentials, missing token)
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

/**
 * 403 Forbidden
 * Use for authorization failures (user doesn't have permission)
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

/**
 * 404 Not Found
 * Use when a requested resource doesn't exist
 */
export class NotFoundError extends AppError {
    constructor(message: string = 'Not Found') {
        super(message, 404);
    }
}

/**
 * 409 Conflict
 * Use for conflicts like duplicate email, username already taken
 */
export class ConflictError extends AppError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
    }
}

/**
 * 422 Unprocessable Entity
 * Use for semantic validation errors (e.g., business rule violations)
 */
export class UnprocessableEntityError extends AppError {
    constructor(message: string = 'Unprocessable Entity') {
        super(message, 422);
    }
}
