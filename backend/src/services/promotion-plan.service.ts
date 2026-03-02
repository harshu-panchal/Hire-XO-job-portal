import PromotionPlan from '../models/promotion-plan.model';
import { RazorpayService } from './razorpay.service';

export class PromotionPlanService {
    private razorpayService: RazorpayService;

    constructor() {
        this.razorpayService = new RazorpayService();
    }

    private normalizePlanId(planId?: string) {
        if (typeof planId !== 'string') return undefined;
        const trimmed = planId.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }

    private async createRazorpayPlanForBilling(planLike: {
        name: string;
        price: number;
        duration: number;
    }): Promise<string> {
        if (!this.razorpayService.isConfigured()) {
            throw new Error(
                'Razorpay keys are not configured. Configure RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET or provide a valid razorpayPlanId.'
            );
        }

        console.log('[PromotionPlanService.createRazorpayPlanForBilling] Creating Razorpay plan for promotion plan:', {
            name: planLike.name,
            price: planLike.price,
            duration: planLike.duration
        });

        const created = await this.razorpayService.createPlan({
            name: planLike.name,
            amount: planLike.price,
            durationDays: planLike.duration,
            description: `Promotion plan: ${planLike.name}`,
            currency: 'INR'
        });

        console.log('[PromotionPlanService.createRazorpayPlanForBilling] Created Razorpay plan id:', created.id);

        return created.id;
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

        const normalizedPrice = Number(data.price);
        const normalizedDuration = Number(data.duration);

        let razorpayPlanId = this.normalizePlanId(data.razorpayPlanId);

        if (normalizedPrice > 0 && !razorpayPlanId) {
            razorpayPlanId = await this.createRazorpayPlanForBilling({
                name: data.name,
                price: normalizedPrice,
                duration: normalizedDuration
            });
        } else if (normalizedPrice <= 0) {
            razorpayPlanId = undefined;
        }

        const payload = {
            ...data,
            price: normalizedPrice,
            duration: normalizedDuration,
            razorpayPlanId
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

        const existing = await PromotionPlan.findById(id);
        if (!existing) {
            throw new Error('Promotion plan not found');
        }

        const currentRazorpayPlanId = this.normalizePlanId(existing.razorpayPlanId) || '';
        const incomingRazorpayPlanIdRaw =
            typeof data.razorpayPlanId === 'string' ? data.razorpayPlanId.trim() : undefined;

        const mergedPlan = {
            name: typeof data.name === 'string' ? data.name : existing.name,
            price: typeof data.price !== 'undefined' ? Number(data.price) : existing.price,
            duration: typeof data.duration !== 'undefined' ? Number(data.duration) : existing.duration
        };

        const billingChanged =
            mergedPlan.price !== existing.price ||
            mergedPlan.duration !== existing.duration;

        const adminProvidedDifferentPlanId =
            typeof incomingRazorpayPlanIdRaw === 'string' &&
            incomingRazorpayPlanIdRaw.length > 0 &&
            incomingRazorpayPlanIdRaw !== currentRazorpayPlanId;

        const updateData: any = {
            ...data
        };

        if (typeof data.price !== 'undefined') {
            updateData.price = mergedPlan.price;
        }
        if (typeof data.duration !== 'undefined') {
            updateData.duration = mergedPlan.duration;
        }

        if (mergedPlan.price <= 0) {
            updateData.razorpayPlanId = undefined;
        } else if (adminProvidedDifferentPlanId) {
            updateData.razorpayPlanId = incomingRazorpayPlanIdRaw;
        } else {
            const shouldAutoCreateOrRotate =
                billingChanged ||
                !currentRazorpayPlanId ||
                incomingRazorpayPlanIdRaw === '';

            if (shouldAutoCreateOrRotate) {
                updateData.razorpayPlanId = await this.createRazorpayPlanForBilling(mergedPlan);
            } else if (incomingRazorpayPlanIdRaw) {
                updateData.razorpayPlanId = incomingRazorpayPlanIdRaw;
            }
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
