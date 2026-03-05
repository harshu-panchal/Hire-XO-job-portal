import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.config';

// Extend Express Request to include user
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}


const resolveTokenFromRequest = (req: AuthRequest): string | undefined => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const headerToken = authHeader.split(' ')[1];
        if (headerToken) {
            return headerToken;
        }
    }

    const queryToken = typeof req.query?.token === 'string' ? req.query.token : undefined;
    if (queryToken) {
        return queryToken;
    }

    return undefined;
};

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : undefined;

    if (!token) {
        res.status(401).json({ message: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; email: string; role: string };

        // STEP 1 FIX: Verify user status in DB to prevent banned user bypass
        const User = require('../models/user.model').default;
        const user = await User.findById(decoded.id).select('status role email').lean();

        if (!user) {
            res.status(401).json({ message: 'User no longer exists' });
            return;
        }

        if (user.status !== 'active') {
            res.status(403).json({
                message: `Your account is ${user.status}. Access denied.`,
                code: 'USER_NOT_ACTIVE'
            });
            return;
        }

        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
    }
};


export const authenticateTokenForDownload = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = resolveTokenFromRequest(req);

    if (!token) {
        res.status(401).json({ message: 'Access token required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; email: string; role: string };

        const User = require('../models/user.model').default;
        const user = await User.findById(decoded.id).select('status role email').lean();

        if (!user) {
            res.status(401).json({ message: 'User no longer exists' });
            return;
        }

        if (user.status !== 'active') {
            res.status(403).json({
                message: `Your account is ${user.status}. Access denied.`,
                code: 'USER_NOT_ACTIVE'
            });
            return;
        }

        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
    }
};

export const optionalAuthenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        next();
        return;
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; email: string; role: string };

        // Load user from DB and ensure active status, mirroring authenticateToken checks,
        // but treat failures as anonymous instead of blocking the request.
        const User = require('../models/user.model').default;
        const user = await User.findById(decoded.id).select('status role email').lean();

        if (!user || user.status !== 'active') {
            // User missing or not active: behave as if unauthenticated
            next();
            return;
        }

        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };
    } catch (error) {
        // Token invalid/expired: behave as unauthenticated without throwing
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
                success: false,
                message: 'Active subscription required to access this feature.',
                code: 'SUBSCRIPTION_EXPIRED'
            });
        }
    } catch (error) {
        console.error('Subscription check error:', error);
        res.status(500).json({ message: 'Internal server error during subscription check' });
    }
};

