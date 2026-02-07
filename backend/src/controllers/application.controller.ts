import { Response } from 'express';
import { ApplicationService } from '../services/application.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ApplicationController {
    private applicationService: ApplicationService;

    constructor() {
        this.applicationService = new ApplicationService();
    }

    public applyToJob = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
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
            res.status(201).json({
                message: 'Application submitted successfully',
                application
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Failed to apply' });
        }
    };

    public applyToResource = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { resourceId, resourceType } = req.params;

            const application = await this.applicationService.applyToResource(
                userId,
                resourceId,
                resourceType,
                req.body
            );
            res.status(201).json({
                message: 'Application submitted successfully',
                application
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Failed to apply' });
        }
    };

    public getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const applications = await this.applicationService.getMyApplications(userId);
            res.status(200).json(applications);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch applications' });
        }
    };

    public getJobApplications = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { jobId } = req.params;
            const applications = await this.applicationService.getJobApplications(jobId, userId);
            res.status(200).json(applications);
        } catch (error: any) {
            res.status(403).json({ message: error.message || 'Failed to fetch applications' });
        }
    };

    public getReceivedApplications = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const applications = await this.applicationService.getReceivedApplications(userId);
            res.status(200).json(applications);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch applications' });
        }
    };

    public getResourceApplications = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { resourceId, resourceType } = req.params;
            const applications = await this.applicationService.getResourceApplications(
                resourceId,
                resourceType,
                userId
            );
            res.status(200).json(applications);
        } catch (error: any) {
            res.status(403).json({ message: error.message || 'Failed to fetch applications' });
        }
    };

    public getReceivedResourceApplications = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            // We need the user's resource category. 
            // We can fetch user profile or pass it if frontend knows.
            // Better to fetch user profile here to be secure/accurate.
            const { User } = require('../models/user.model');
            const { ResourceProfile } = require('../models/resource-profile.model');
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
                res.status(400).json({ message: 'Category is required' });
                return;
            }

            const applications = await this.applicationService.getReceivedResourceApplications(userId, category as string);
            res.status(200).json(applications);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch applications' });
        }
    };

    public updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { applicationId } = req.params;
            const { status, type } = req.body; // type: 'job' or 'resource'

            if (!['Accepted', 'Rejected'].includes(status)) {
                res.status(400).json({ message: 'Invalid status' });
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
                message: 'Application status updated',
                application
            });
        } catch (error: any) {
            res.status(403).json({ message: error.message || 'Failed to update status' });
        }
    };
}
