import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { InterviewService } from '../services/interview.service';

export class InterviewController {
    private interviewService: InterviewService;

    constructor() {
        this.interviewService = new InterviewService();
    }

    public scheduleInterview = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const requesterId = req.user?.id;
            const requesterRole = req.user?.role;
            if (!requesterId || !requesterRole) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const interviewData = {
                ...req.body,
                employerId: requesterRole === 'admin' ? req.body.employerId : requesterId,
                requesterId,
                requesterRole
            };

            const interview = await this.interviewService.createInterview(interviewData);
            res.status(201).json(interview);
        } catch (error: any) {
            const message = error.message || 'Failed to schedule interview';
            if (
                message.includes('subscription required') ||
                message.includes('subscription')
            ) {
                res.status(403).json({ message });
                return;
            }
            if (
                message.includes('before scheduling interview') ||
                message.includes('SLA window') ||
                message.includes('one month') ||
                message.includes('Without employee verification tier')
            ) {
                res.status(409).json({ message });
                return;
            }
            res.status(400).json({ message });
        }
    };

    public getMyInterviews = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            if (!userId || !role) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const interviews = await this.interviewService.getInterviewsForUser(userId, role);
            res.status(200).json(interviews);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Failed to fetch interviews' });
        }
    };

    public updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { interviewId } = req.params;
            const { status } = req.body;

            const interview = await this.interviewService.updateInterviewStatus(interviewId, status, userId);
            res.status(200).json(interview);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Failed to update interview status' });
        }
    };

    public updateInterview = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const role = req.user?.role;
            if (!userId || !role) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { interviewId } = req.params;
            const interview = await this.interviewService.updateInterview(interviewId, req.body, userId, role);
            res.status(200).json(interview);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Failed to update interview' });
        }
    };

    public cancelInterview = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { interviewId } = req.params;
            await this.interviewService.deleteInterview(interviewId, userId);
            res.status(200).json({ message: 'Interview cancelled successfully' });
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Failed to cancel interview' });
        }
    };
}
