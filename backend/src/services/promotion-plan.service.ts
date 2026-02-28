import PromotionPlan from '../models/promotion-plan.model';

export class PromotionPlanService {
    private normalizePlanId(planId?: string) {
        if (typeof planId !== 'string') return undefined;
        const trimmed = planId.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }

    // Create a new promotion plan (Admin only)
    public async createPlan(data: {
        name: string;
        price: number;
        duration: number;
        estimatedReachMin: number;
        estimatedReachMax: number;
        priority: number;
        features: string[];
        isMostPopular?: boolean;
        razorpayPlanId?: string;
    }) {
        // Validate reach range
        if (data.estimatedReachMin > data.estimatedReachMax) {
            throw new Error('Minimum reach cannot be greater than maximum reach');
        }

        // If marking as most popular, unmark others
        if (data.isMostPopular) {
            await PromotionPlan.updateMany(
                { isMostPopular: true },
                { isMostPopular: false }
            );
        }

        const payload = {
            ...data,
            razorpayPlanId: this.normalizePlanId(data.razorpayPlanId)
        };

        const plan = await PromotionPlan.create(payload);
        return plan;
    }

    // Get all promotion plans (with optional active filter)
    public async getAllPlans(activeOnly: boolean = false) {
        const query = activeOnly ? { isActive: true } : {};
        const plans = await PromotionPlan.find(query).sort({ priority: -1 }); // Higher priority first
        return plans;
    }

    // Get a single plan by ID
    public async getPlanById(id: string) {
        const plan = await PromotionPlan.findById(id);
        if (!plan) {
            throw new Error('Promotion plan not found');
        }
        return plan;
    }

    // Update a promotion plan (Admin only)
    public async updatePlan(id: string, data: Partial<{
        name: string;
        price: number;
        duration: number;
        estimatedReachMin: number;
        estimatedReachMax: number;
        priority: number;
        features: string[];
        isMostPopular: boolean;
        isActive: boolean;
        razorpayPlanId: string;
    }>) {
        // Validate reach range if both are provided
        if (data.estimatedReachMin !== undefined && data.estimatedReachMax !== undefined) {
            if (data.estimatedReachMin > data.estimatedReachMax) {
                throw new Error('Minimum reach cannot be greater than maximum reach');
            }
        }

        // If marking as most popular, unmark others
        if (data.isMostPopular) {
            await PromotionPlan.updateMany(
                { _id: { $ne: id }, isMostPopular: true },
                { isMostPopular: false }
            );
        }

        const updateData: any = { ...data };
        if (Object.prototype.hasOwnProperty.call(data, 'razorpayPlanId')) {
            updateData.razorpayPlanId = this.normalizePlanId(data.razorpayPlanId);
        }

        const plan = await PromotionPlan.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!plan) {
            throw new Error('Promotion plan not found');
        }

        return plan;
    }

    // Delete a promotion plan (Admin only)
    // Soft delete by marking as inactive
    public async deletePlan(id: string) {
        const plan = await PromotionPlan.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!plan) {
            throw new Error('Promotion plan not found');
        }

        return plan;
    }

    // Hard delete (use with caution)
    public async hardDeletePlan(id: string) {
        // Check if plan is in use
        const Promotion = require('../models/promotion.model').default;
        const promotionsUsingPlan = await Promotion.countDocuments({ planId: id });

        if (promotionsUsingPlan > 0) {
            throw new Error('Cannot delete plan that is currently in use by promotions');
        }

        const plan = await PromotionPlan.findByIdAndDelete(id);
        if (!plan) {
            throw new Error('Promotion plan not found');
        }

        return plan;
    }
}
