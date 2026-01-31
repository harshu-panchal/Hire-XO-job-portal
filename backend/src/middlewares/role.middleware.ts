import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const requireRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: `Forbidden: Requires one of the following roles: ${allowedRoles.join(', ')}`
            });
            return;
        }

        next();
    };
};

export const requireJobSeeker = requireRole('job-seeker');
export const requireRecruiter = requireRole('recruiter');
export const requireResource = requireRole('resource');
export const requireRecruiterOrResource = requireRole('recruiter', 'resource');
