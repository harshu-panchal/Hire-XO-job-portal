import { Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class SubscriptionController {
    private subscriptionService: SubscriptionService;

    constructor() {
        this.subscriptionService = new SubscriptionService();
    }

    public getAllPlans = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const { type } = req.query;
            const plans = await this.subscriptionService.getAllPlans(type as string);
            res.status(200).json(plans);
        } catch (error: any) {
            next(error);
        }
    };

    public getWalletBalance = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const result = await this.subscriptionService.getWalletBalance(userId);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    public rechargeWallet = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { amount } = req.body;
            if (!amount || typeof amount !== 'number') {
                res.status(400).json({ message: 'Valid amount is required' });
                return;
            }

            const result = await this.subscriptionService.rechargeWallet(userId, amount);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    public purchaseSubscription = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { planId } = req.body;
            if (!planId) {
                res.status(400).json({ message: 'Plan ID is required' });
                return;
            }

            const result = await this.subscriptionService.purchaseSubscription(userId, planId);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    public checkSubscriptionStatus = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const result = await this.subscriptionService.checkSubscriptionStatus(userId);
            res.status(200).json(result);
        } catch (error: any) {
            next(error);
        }
    };

    // ========== ADMIN ONLY METHODS ==========

    /**
     * Create a new subscription plan (Admin only)
     * POST /api/admin/plans
     */
    public createPlan = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const { name, price, durationDays, description, features } = req.body;

            if (!name || !price || !durationDays || !description) {
                res.status(400).json({
                    success: false,
                    message: 'Name, price, durationDays, and description are required'
                });
                return;
            }

            const plan = await this.subscriptionService.createPlan({
                name,
                price,
                durationDays,
                description,
                features: features || []
            });

            res.status(201).json({
                success: true,
                message: 'Subscription plan created successfully',
                data: plan
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * Update a subscription plan (Admin only)
     * PUT /api/admin/plans/:id
     */
    public updatePlan = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const plan = await this.subscriptionService.updatePlan(id, updateData);

            res.status(200).json({
                success: true,
                message: 'Subscription plan updated successfully',
                data: plan
            });
        } catch (error: any) {
            next(error);
        }
    };

    /**
     * Delete a subscription plan (Admin only - soft delete)
     * DELETE /api/admin/plans/:id
     */
    public deletePlan = async (req: AuthRequest, res: Response, next: import('express').NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            await this.subscriptionService.deletePlan(id);

            res.status(200).json({
                success: true,
                message: 'Subscription plan deleted successfully'
            });
        } catch (error: any) {
            next(error);
        }
    };
}
