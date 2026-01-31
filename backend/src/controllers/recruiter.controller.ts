import { Request, Response } from 'express';
import Recruiter from '../models/recruiter.model';

export class RecruiterController {
    public getProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id || req.query.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const recruiter = await Recruiter.findOne({ userId });
            if (!recruiter) {
                res.status(404).json({ message: 'Recruiter profile not found' });
                return;
            }
            res.status(200).json(recruiter);
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching profile', error: error.message });
        }
    };

    public updateProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id || req.body.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const updatedRecruiter = await Recruiter.findOneAndUpdate(
                { userId },
                req.body,
                { new: true, upsert: true } // Create if doesn't exist
            );

            res.status(200).json({ message: 'Profile updated', data: updatedRecruiter });
        } catch (error: any) {
            res.status(500).json({ message: 'Error updating profile', error: error.message });
        }
    };
}
