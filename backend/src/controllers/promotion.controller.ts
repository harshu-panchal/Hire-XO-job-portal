import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Promotion from '../models/promotion.model';

export class PromotionController {

    // Create a new promotion
    public createPromotion = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const { resourceId, resourceType, budget } = req.body;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            if (!resourceId || !resourceType || !budget) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }

            // Pricing logic: 1 unit budget = ~1.5 - 2 reach
            const minReach = Math.floor(budget * 1.5);
            const maxReach = Math.floor(budget * 2.5);
            const estimatedReach = `${minReach} - ${maxReach}`;

            const promotion = await Promotion.create({
                userId,
                resourceId,
                resourceType,
                budget,
                estimatedReach,
                status: 'Active',
                startDate: new Date()
            });

            // Simulate immediate effect
            res.status(201).json({
                message: 'Promotion created successfully',
                promotion
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to create promotion' });
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

            const promotions = await Promotion.find({ userId }).sort({ createdAt: -1 });

            // Calculate total stats
            const totalSpent = promotions.reduce((acc, curr) => acc + curr.budget, 0);
            const activeCount = promotions.filter(c => c.status === 'Active').length;

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
                    totalSpent,
                    activeCount,
                    totalReach: `${totalMinReach} - ${totalMaxReach}`
                }
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Failed to fetch promotions' });
        }
    };
}
