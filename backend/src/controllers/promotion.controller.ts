import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Promotion from '../models/promotion.model';
import { PromotionService } from '../services/promotion.service';

export class PromotionController {
    private promotionService: PromotionService;

    constructor() {
        this.promotionService = new PromotionService();
    }

    // Create a new promotion with plan-based logic
    public createPromotion = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const { resourceId, resourceType, planId } = req.body;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            if (!resourceId || !resourceType || !planId) {
                res.status(400).json({ message: 'Missing required fields: resourceId, resourceType, planId' });
                return;
            }

            const promotion = await this.promotionService.createPromotion(
                userId,
                resourceId,
                resourceType,
                planId
            );

            res.status(201).json({
                message: 'Promotion created successfully',
                promotion
            });
        } catch (error: any) {
            const message = error?.message || 'Failed to create promotion';
            const statusCode = this.getPromotionErrorStatusCode(message);
            res.status(statusCode).json({ message });
        }
    };

    // Get my promotions
    public getMyPromotions = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const promotions = await this.promotionService.getMyPromotions(userId);
            const stats = await this.promotionService.getPromotionStats(userId);

            // Calculate total estimated reach
            let totalMinReach = 0;
            let totalMaxReach = 0;

            promotions.forEach(c => {
                const parts = c.estimatedReach.split(' - ');
                if (parts.length === 2) {
                    const min = parseInt(parts[0].replace(/[^0-9]/g, '')) || 0;
                    const max = parseInt(parts[1].replace(/[^0-9]/g, '')) || 0;
                    totalMinReach += min;
                    totalMaxReach += max;
                }
            });

            res.status(200).json({
                promotions,
                stats: {
                    totalSpent: stats.totalSpent,
                    activeCount: stats.activePromotions,
                    totalReach: `${totalMinReach} - ${totalMaxReach}`
                }
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch promotions' });
        }
    };

    private getPromotionErrorStatusCode(message: string): number {
        const normalizedMessage = message.toLowerCase();

        if (
            normalizedMessage.includes('invalid resource type') ||
            normalizedMessage.includes('missing required fields') ||
            normalizedMessage.includes('no longer available')
        ) {
            return 400;
        }

        if (normalizedMessage.includes('you can only promote your own')) {
            return 403;
        }

        if (
            normalizedMessage.includes('not found') ||
            normalizedMessage.includes('plan not found')
        ) {
            return 404;
        }

        if (normalizedMessage.includes('already has an active promotion')) {
            return 409;
        }

        return 500;
    }
}
