import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ message: 'Access token required' });
        return;
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secretKey) as { id: string; email: string; role: string };

        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
    }
};

export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        next();
        return;
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secretKey) as { id: string; email: string; role: string };
        req.user = decoded;
    } catch (error) {
        // Token invalid, but don't block the request
    }

    next();
};

// Role-based access control middleware
export const requireRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: `Access denied. Required role: ${allowedRoles.join(' or ')}` });
            return;
        }

        next();
    };
};
