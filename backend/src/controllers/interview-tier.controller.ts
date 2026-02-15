import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { InterviewTierService } from '../services/interview-tier.service';

export class InterviewTierController {
    private interviewTierService: InterviewTierService;

    constructor() {
        this.interviewTierService = new InterviewTierService();
    }

    public getPublicTiers = async (_req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const tiers = await this.interviewTierService.getActiveTiers();
            if (tiers.length === 0) {
                await this.interviewTierService.bootstrapDefaults();
            }
            const refreshed = await this.interviewTierService.getActiveTiers();
            res.status(200).json(refreshed);
        } catch (error: any) {
            next(error);
        }
    };

    public purchaseTier = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const { tierId } = req.body;
            if (!tierId) {
                res.status(400).json({ message: 'Tier ID is required' });
                return;
            }
            const result = await this.interviewTierService.purchaseTier(userId, tierId);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    public getAdminTiers = async (_req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const tiers = await this.interviewTierService.getAllTiers();
            res.status(200).json({ success: true, data: tiers });
        } catch (error: any) {
            next(error);
        }
    };

    public bootstrapAdminTiers = async (_req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const result = await this.interviewTierService.bootstrapDefaults();
            res.status(200).json({
                success: true,
                message: result.created.length > 0
                    ? 'Default interview tiers created successfully'
                    : 'Interview tiers already exist. No new defaults created.',
                data: result
            });
        } catch (error: any) {
            next(error);
        }
    };

    public createAdminTier = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const tier = await this.interviewTierService.createTier(req.body);
            res.status(201).json({ success: true, data: tier, message: 'Interview tier created successfully' });
        } catch (error: any) {
            next(error);
        }
    };

    public updateAdminTier = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const tier = await this.interviewTierService.updateTier(req.params.id, req.body);
            res.status(200).json({ success: true, data: tier, message: 'Interview tier updated successfully' });
        } catch (error: any) {
            next(error);
        }
    };

    public deleteAdminTier = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const tier = await this.interviewTierService.deleteTier(req.params.id);
            res.status(200).json({ success: true, data: tier, message: 'Interview tier deleted successfully' });
        } catch (error: any) {
            next(error);
        }
    };
}
