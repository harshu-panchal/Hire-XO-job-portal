import { Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class SubscriptionController {
    private subscriptionService: SubscriptionService;

    constructor() {
        this.subscriptionService = new SubscriptionService();
    }

    public getAllPlans = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const plans = await this.subscriptionService.getAllPlans();
            res.status(200).json(plans);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch plans' });
        }
    };

    public getWalletBalance = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const result = await this.subscriptionService.getWalletBalance(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Failed to fetch balance' });
        }
    };

    public rechargeWallet = async (req: AuthRequest, res: Response): Promise<void> => {
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
            res.status(400).json({ message: error.message || 'Failed to recharge wallet' });
        }
    };

    public purchaseSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
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
            res.status(400).json({ message: error.message || 'Failed to purchase subscription' });
        }
    };

    public checkSubscriptionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const result = await this.subscriptionService.checkSubscriptionStatus(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Failed to check status' });
        }
    };
}
