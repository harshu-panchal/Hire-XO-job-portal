import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { PromotionPlanService } from '../services/promotion-plan.service';

export class PromotionPlanController {
    private promotionPlanService: PromotionPlanService;

    constructor() {
        this.promotionPlanService = new PromotionPlanService();
    }

    // Get all active promotion plans (Public)
    public getAllPlans = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const activeOnly = req.query.activeOnly !== 'false'; // Default to true
            const plans = await this.promotionPlanService.getAllPlans(activeOnly);

            res.status(200).json({
                success: true,
                data: plans
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch promotion plans'
            });
        }
    };

    // Create a new promotion plan (Admin only)
    public createPlan = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const {
                name,
                price,
                duration,
                estimatedReachMin,
                estimatedReachMax,
                priority,
                features,
                isMostPopular,
                razorpayPlanId
            } = req.body;

            if (!name || !price || !duration || !estimatedReachMin || !estimatedReachMax || !priority) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
                return;
            }

            const plan = await this.promotionPlanService.createPlan({
                name,
                price,
                duration,
                estimatedReachMin,
                estimatedReachMax,
                priority,
                features: features || [],
                isMostPopular: isMostPopular || false,
                razorpayPlanId
            });

            res.status(201).json({
                success: true,
                message: 'Promotion plan created successfully',
                data: plan
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create promotion plan'
            });
        }
    };

    // Update a promotion plan (Admin only)
    public updatePlan = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const plan = await this.promotionPlanService.updatePlan(id, req.body);

            res.status(200).json({
                success: true,
                message: 'Promotion plan updated successfully',
                data: plan
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update promotion plan'
            });
        }
    };

    // Delete a promotion plan (Admin only - soft delete)
    public deletePlan = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const plan = await this.promotionPlanService.deletePlan(id);

            res.status(200).json({
                success: true,
                message: 'Promotion plan deleted successfully',
                data: plan
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete promotion plan'
            });
        }
    };
}
