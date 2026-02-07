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
    let token: string | undefined;

    const authHeader = req.headers['authorization'];
    if (authHeader) {
        token = authHeader.split(' ')[1];
    } else if (req.query.token) {
        token = req.query.token as string;
    }

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

/**
 * Subscription Enforcement Middleware (Soft Mode / Dry Run)
 * Checks if subscription is active but does NOT block the request.
 * Adds subscription status to the request object or logs it.
 */
// Subscription Enforcement Middleware (Hard Mode)
export const checkSubscription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            // If not authenticated (and route allows it), pass. 
            // But if route needed auth, authenticateToken should have run first.
            next();
            return;
        }

        const User = require('../models/user.model').default;
        const user = await User.findById(req.user.id);

        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Admin always bypasses
        if (user.role === 'admin') {
            next();
            return;
        }

        // Job Seekers / Employees usually don't need subscription check for general access
        // But if this middleware is applied, it means we WANT to check.
        // However, to be safe and avoid breaking basic features, we only strictly enforce 
        // for Recruiter/Employer users if they are accessing paid features.
        // If the middleware is applied globally, we must be careful.
        // For now, we assume this middleware is applied selectively to Paid Routes.

        // Check expiry
        const now = new Date();
        if (user.subscriptionExpiry && new Date(user.subscriptionExpiry) > now) {
            // Active subscription
            next();
        } else {
            // Expired or no subscription
            res.status(403).json({
                message: 'Active subscription required to access this feature.',
                code: 'SUBSCRIPTION_EXPIRED'
            });
        }
    } catch (error) {
        console.error('Subscription check error:', error);
        res.status(500).json({ message: 'Internal server error during subscription check' });
    }
};

