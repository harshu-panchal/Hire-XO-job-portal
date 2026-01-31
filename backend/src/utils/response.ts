import { Response } from 'express';

/**
 * Response Utility Functions
 * Standardized API response formatting
 */

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp?: string;
}

export interface PaginatedResponse<T = any> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    timestamp?: string;
}

/**
 * Send success response
 * @param res - Express response object
 * @param data - Response data
 * @param message - Success message
 * @param statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = <T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
): void => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    };
    res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param res - Express response object
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 * @param error - Detailed error information
 */
export const sendError = (
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = 500,
    error?: string
): void => {
    const response: ApiResponse = {
        success: false,
        message,
        error,
        timestamp: new Date().toISOString()
    };
    res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param res - Express response object
 * @param data - Array of data items
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @param statusCode - HTTP status code (default: 200)
 */
export const sendPaginated = <T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    statusCode: number = 200
): void => {
    const response: PaginatedResponse<T> = {
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        timestamp: new Date().toISOString()
    };
    res.status(statusCode).json(response);
};

/**
 * Send created response (201)
 * @param res - Express response object
 * @param data - Created resource data
 * @param message - Success message
 */
export const sendCreated = <T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
): void => {
    sendSuccess(res, data, message, 201);
};

/**
 * Send no content response (204)
 * @param res - Express response object
 */
export const sendNoContent = (res: Response): void => {
    res.status(204).send();
};

/**
 * Send bad request error (400)
 * @param res - Express response object
 * @param message - Error message
 * @param error - Detailed error
 */
export const sendBadRequest = (
    res: Response,
    message: string = 'Bad request',
    error?: string
): void => {
    sendError(res, message, 400, error);
};

/**
 * Send unauthorized error (401)
 * @param res - Express response object
 * @param message - Error message
 */
export const sendUnauthorized = (
    res: Response,
    message: string = 'Unauthorized'
): void => {
    sendError(res, message, 401);
};

/**
 * Send forbidden error (403)
 * @param res - Express response object
 * @param message - Error message
 */
export const sendForbidden = (
    res: Response,
    message: string = 'Forbidden'
): void => {
    sendError(res, message, 403);
};

/**
 * Send not found error (404)
 * @param res - Express response object
 * @param message - Error message
 */
export const sendNotFound = (
    res: Response,
    message: string = 'Resource not found'
): void => {
    sendError(res, message, 404);
};

/**
 * Send conflict error (409)
 * @param res - Express response object
 * @param message - Error message
 */
export const sendConflict = (
    res: Response,
    message: string = 'Resource already exists'
): void => {
    sendError(res, message, 409);
};

/**
 * Send validation error (422)
 * @param res - Express response object
 * @param errors - Validation errors
 */
export const sendValidationError = (
    res: Response,
    errors: any,
    message: string = 'Validation failed'
): void => {
    const response = {
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString()
    };
    res.status(422).json(response);
};

/**
 * Send internal server error (500)
 * @param res - Express response object
 * @param message - Error message
 * @param error - Detailed error
 */
export const sendServerError = (
    res: Response,
    message: string = 'Internal server error',
    error?: string
): void => {
    sendError(res, message, 500, error);
};
