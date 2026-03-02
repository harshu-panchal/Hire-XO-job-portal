import InterviewTier from '../models/interview-tier.model';
import User from '../models/user.model';
import { RazorpayService } from './razorpay.service';

export class InterviewTierService {
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
        durationDays: number;
        description: string;
    }): Promise<string> {
        if (!this.razorpayService.isConfigured()) {
            throw new Error(
                'Razorpay keys are not configured. Configure RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET or provide a valid razorpayPlanId.'
            );
        }

        const created = await this.razorpayService.createPlan({
            name: planLike.name,
            amount: planLike.price,
            durationDays: planLike.durationDays,
            description: planLike.description,
            currency: 'INR'
        });

        return created.id;
    }

    private readonly defaultTiers = [
        {
            name: 'Tier 2',
            price: 99,
            durationDays: 30,
            maxScheduleDays: 30,
            description: 'Interview scheduling window: 15-30 days from application date.',
            features: ['Verification timeline: 15-30 days', 'Improved recruiter visibility'],
            order: 2,
            isActive: true
        },
        {
            name: 'Tier 3',
            price: 149,
            durationDays: 30,
            maxScheduleDays: 15,
            description: 'Interview scheduling window: 7-15 days from application date.',
            features: ['Verification timeline: 7-15 days', 'Higher recruiter priority'],
            order: 3,
            isActive: true
        },
        {
            name: 'Tier 4',
            price: 199,
            durationDays: 30,
            maxScheduleDays: 7,
            description: 'Up to 7 days interview scheduling window from application date.',
            features: ['Stage 1 clearance', 'Urgent recruiter visibility', 'Interview scheduling SLA: up to 7 days'],
            order: 4,
            isActive: true
        }
    ];

    public async getActiveTiers() {
        return await InterviewTier.find({ isActive: true }).sort({ order: 1, maxScheduleDays: 1, price: 1 });
    }

    public async getAllTiers() {
        return await InterviewTier.find().sort({ order: 1, maxScheduleDays: 1, price: 1 });
    }

    public async bootstrapDefaults() {
        const existing = await InterviewTier.find({ isActive: true });
        if (existing.length > 0) {
            return { created: [], existingCount: existing.length };
        }

        const created = [];
        for (const tier of this.defaultTiers) {
            const byName = await InterviewTier.findOne({ name: tier.name });
            if (byName) {
                const updated = await InterviewTier.findByIdAndUpdate(byName._id, tier, { new: true });
                if (updated) created.push(updated);
                continue;
            }

            const doc = await InterviewTier.create(tier);
            created.push(doc);
        }

        return { created, existingCount: 0 };
    }

    public async createTier(data: any) {
        const normalizedPrice = Number(data.price);
        const normalizedDurationDays = Number(data.durationDays);

        let razorpayPlanId = this.normalizePlanId(data.razorpayPlanId);

        if (normalizedPrice > 0 && !razorpayPlanId) {
            razorpayPlanId = await this.createRazorpayPlanForBilling({
                name: data.name,
                price: normalizedPrice,
                durationDays: normalizedDurationDays,
                description: data.description
            });
        } else if (normalizedPrice <= 0) {
            razorpayPlanId = undefined;
        }

        const payload = {
            ...data,
            price: normalizedPrice,
            durationDays: normalizedDurationDays,
            razorpayPlanId
        };

        return await InterviewTier.create(payload);
    }

    public async updateTier(id: string, data: any) {
        const existing = await InterviewTier.findById(id);
        if (!existing) throw new Error('Interview tier not found');

        const currentRazorpayPlanId = this.normalizePlanId(existing.razorpayPlanId) || '';
        const incomingRazorpayPlanIdRaw =
            typeof data.razorpayPlanId === 'string' ? data.razorpayPlanId.trim() : undefined;

        const mergedPlan = {
            name: typeof data.name === 'string' ? data.name : existing.name,
            price: typeof data.price !== 'undefined' ? Number(data.price) : existing.price,
            durationDays: typeof data.durationDays !== 'undefined' ? Number(data.durationDays) : existing.durationDays,
            description: typeof data.description === 'string' ? data.description : existing.description
        };

        const billingChanged =
            mergedPlan.price !== existing.price ||
            mergedPlan.durationDays !== existing.durationDays;

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
        if (typeof data.durationDays !== 'undefined') {
            updateData.durationDays = mergedPlan.durationDays;
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

        const tier = await InterviewTier.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!tier) throw new Error('Interview tier not found');
        return tier;
    }

    public async deleteTier(id: string) {
        const tier = await InterviewTier.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!tier) throw new Error('Interview tier not found');
        return tier;
    }

    public async purchaseTier(userId: string, tierId: string) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        if (!['employee', 'job-seeker'].includes(user.role as any)) {
            throw new Error('Only employees can purchase interview tiers');
        }

        const tier = await InterviewTier.findById(tierId);
        if (!tier || !tier.isActive) throw new Error('Interview tier not found');

        const currentBalance = user.walletBalance || 0;
        if (currentBalance < tier.price) {
            throw new Error(`Insufficient balance. Required: ${tier.price}, Available: ${currentBalance}`);
        }

        const now = new Date();
        const expiryDate = new Date(now.getTime() + tier.durationDays * 24 * 60 * 60 * 1000);
        const newBalance = currentBalance - tier.price;

        const mongoose = require('mongoose');
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await User.findByIdAndUpdate(userId, {
                walletBalance: newBalance,
                interviewTierId: String(tier._id),
                interviewTierExpiry: expiryDate
            }, { session });

            const Transaction = require('../models/transaction.model').default;
            await Transaction.create([{
                userId,
                type: 'deduction',
                amount: tier.price,
                description: `Interview Tier: ${tier.name} (${tier.durationDays} days)`,
                status: 'completed',
                createdAt: new Date()
            }], { session });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

        return {
            message: 'Interview tier purchased successfully',
            tier: {
                id: tier._id,
                name: tier.name,
                maxScheduleDays: tier.maxScheduleDays,
                durationDays: tier.durationDays,
                expiryDate
            },
            walletBalance: newBalance
        };
    }
}
