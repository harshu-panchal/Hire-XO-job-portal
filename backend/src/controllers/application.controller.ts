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

            const application = await this.applicationService.applyToJob(userId, jobId, message);
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
            const { message } = req.body;

            const application = await this.applicationService.applyToResource(
                userId,
                resourceId,
                resourceType,
                message
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
