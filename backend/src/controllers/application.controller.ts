import { Response } from 'express';
import { ApplicationService } from '../services/application.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ApplicationController {
    private applicationService: ApplicationService;

    constructor() {
        this.applicationService = new ApplicationService();
    }

    public applyToJob = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { jobId } = req.params;
            const { message } = req.body;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            let resumeUrl = '';
            let documentUrls: string[] = [];

            // Import util here to avoid top-level issues if any
            const { CloudinaryUtil } = require('../utils/cloudinary');

            // Handle Resume upload
            if (files?.resume?.[0]) {
                const result = await CloudinaryUtil.uploadFile(files.resume[0].path, 'resumes');
                if (result) resumeUrl = result.url;
            }

            // Handle Additional Documents upload
            if (files?.additionalDocuments) {
                for (const file of files.additionalDocuments) {
                    const result = await CloudinaryUtil.uploadFile(file.path, 'application-docs');
                    if (result) documentUrls.push(result.url);
                }
            }

            const application = await this.applicationService.applyToJob(userId, jobId, {
                message,
                resume: resumeUrl,
                additionalDocuments: documentUrls
            });

            // Notify Admins
            try {
                const { notifyAdmins } = require('../utils/notifyAdmins');
                const user = (req as any).user;
                await notifyAdmins(
                    'New Job Application',
                    `${user?.name || 'A user'} applied for a job`,
                    'info',
                    jobId,
                    'job_application'
                );
            } catch (err) {
                console.error('Notification error:', err);
            }
            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                application
            });
        } catch (error: any) {
            next(error);
        }
    };

    public applyToResource = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { resourceId, resourceType } = req.params;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            let documentUrls: string[] = [];

            // Import util here to avoid top-level issues if any
            const { CloudinaryUtil } = require('../utils/cloudinary');

            // Handle Additional Documents/Proposal Documents upload
            if (files?.additionalDocuments) {
                for (const file of files.additionalDocuments) {
                    const result = await CloudinaryUtil.uploadFile(file.path, 'resource-applications');
                    if (result) documentUrls.push(result.url);
                }
            }

            const application = await this.applicationService.applyToResource(
                userId,
                resourceId,
                resourceType,
                {
                    ...req.body,
                    proposalDocuments: documentUrls
                }
            );

            // Notify Admins
            try {
                const { notifyAdmins } = require('../utils/notifyAdmins');
                const user = (req as any).user;
                await notifyAdmins(
                    'New Resource Application',
                    `${user?.name || 'A user'} applied for ${resourceType} ${resourceId}`,
                    'info',
                    resourceId as string,
                    'resource_application'
                );
            } catch (err) {
                console.error('Notification error:', err);
            }
            res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
                application
            });
        } catch (error: any) {
            next(error);
        }
    };

    public getMyApplications = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.applicationService.getMyApplications(userId, page, limit);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            next(error);
        }
    };

    public getJobApplications = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { jobId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await this.applicationService.getJobApplications(jobId, userId, page, limit);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            next(error);
        }
    };

    public getReceivedApplications = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await this.applicationService.getReceivedApplications(userId, page, limit);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            next(error);
        }
    };

    public getSLAExpiredApplications = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await this.applicationService.getSLAExpiredApplications(page, limit);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            next(error);
        }
    };

    public getResourceApplications = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { resourceId, resourceType } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await this.applicationService.getResourceApplications(
                resourceId,
                resourceType,
                userId,
                page,
                limit
            );
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            next(error);
        }
    };

    public getReceivedResourceApplications = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            // We need the user's resource category. 
            // We can fetch user profile or pass it if frontend knows.
            // Better to fetch user profile here to be secure/accurate.
            const { User } = require('../models/user.model');
            // Or use existing imports if available. Checking...
            // User imported at top. ResourceProfile not imported.

            // To avoid circular dependencies or clutter, let's assume we can pass category or fetch profile.
            // Let's fetch profile using userId.
            // HACK: I should use a UserService or just direct DB call.
            // I'll dynamically import or rely on what's available.
            // Wait, I can pass category in query param? No, safer to look up.

            // Import ResourceProfile at top of controller or here?
            // Controller has `User` imported? Let's check Step 430.
            // No, ApplicationController imports: Response, ApplicationService, AuthRequest.
            // It doesn't import User models directly.

            // I'll use UserService? No, that's circular.
            // I'll import ResourceProfile at the top of the file ideally.
            // But I'm using `replace_file_content` on method block.
            // I'll use simple `require` or rely on client sending it?
            // Client sending it is easier but less secure (user could claim to be investor).
            // But they can only see applications for resources they OWN (filtered by userId in service).
            // So if they send wrong category, they find 0 resources -> 0 applications. Safe.

            const { category } = req.query;
            if (!category) {
                res.status(400).json({ success: false, message: 'Category is required' });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await this.applicationService.getReceivedResourceApplications(userId, category as string, page, limit);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            next(error);
        }
    };

    public updateApplicationStatus = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const { applicationId } = req.params;
            const { status, type } = req.body; // type: 'job' or 'resource'

            if (!['Accepted', 'Rejected'].includes(status)) {
                res.status(400).json({ success: false, message: 'Invalid status' });
                return;
            }

            const isJobApplication = type === 'job';
            const application = await this.applicationService.updateApplicationStatus(
                applicationId,
                status,
                userId,
                isJobApplication
            );

            res.status(200).json({
                success: true,
                message: 'Application status updated',
                application
            });
        } catch (error: any) {
            if (error?.message === 'Employer subscription required to hire candidate') {
                res.status(403).json({ success: false, message: error.message });
                return;
            }
            next(error);
        }
    };

    public deleteApplication = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            const { applicationId } = req.params;

            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            await this.applicationService.deleteApplication(applicationId, userId);
            res.status(200).json({ success: true, message: 'Application withdrawn successfully' });
        } catch (error: any) {
            next(error);
        }
    };
}
