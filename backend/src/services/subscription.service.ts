import SubscriptionPlan from '../models/subscription-plan.model';
import User from '../models/user.model';
import CertificateRequest from '../models/certificate-request.model';
import { notifyAdmins } from '../utils/notifyAdmins';
import { RazorpayService } from './razorpay.service';

export class SubscriptionService {
    private razorpayService: RazorpayService;

    constructor() {
        this.razorpayService = new RazorpayService();
    }

    private readonly defaultInterviewTiers = [
        {
            name: 'Tier 2',
            price: 99,
            durationDays: 30,
            maxScheduleDays: 30,
            description: 'Interview scheduling window: 15-30 days from application date.',
            features: ['Verification timeline: 15-30 days', 'Improved recruiter visibility'],
            type: 'job-seeker',
            certificateEligible: true,
            isActive: true
        },
        {
            name: 'Tier 3',
            price: 149,
            durationDays: 30,
            maxScheduleDays: 15,
            description: 'Interview scheduling window: 7-15 days from application date.',
            features: ['Verification timeline: 7-15 days', 'Higher recruiter priority'],
            type: 'job-seeker',
            certificateEligible: true,
            isActive: true
        },
        {
            name: 'Tier 4',
            price: 199,
            durationDays: 30,
            maxScheduleDays: 7,
            description: 'Up to 7 days interview scheduling window from application date.',
            features: ['Stage 1 clearance', 'Urgent recruiter visibility', 'Interview scheduling SLA: up to 7 days'],
            type: 'job-seeker',
            certificateEligible: true,
            isActive: true
        }
    ];

    private normalizePlanNumbers(planData: any) {
        return {
            price: Number(planData.price),
            durationDays: Number(planData.durationDays)
        };
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

        console.log('[SubscriptionService.createRazorpayPlanForBilling] Creating Razorpay plan for subscription plan:', {
            name: planLike.name,
            price: planLike.price,
            durationDays: planLike.durationDays
        });

        const created = await this.razorpayService.createPlan({
            name: planLike.name,
            amount: planLike.price,
            durationDays: planLike.durationDays,
            description: planLike.description,
            currency: 'INR'
        });

        console.log('[SubscriptionService.createRazorpayPlanForBilling] Created Razorpay plan id:', created.id);

        return created.id;
    }

    // Get all active subscription plans
    public async getAllPlans(type?: string) {
        const query: any = { isActive: true };
        if (type) query.type = type;
        const plans = await SubscriptionPlan.find(query).sort({ price: 1 });
        return plans;
    }

    public async getInterviewTiers() {
        return await SubscriptionPlan.find({
            isActive: true,
            type: 'job-seeker',
            maxScheduleDays: { $gt: 0 }
        }).sort({ maxScheduleDays: 1, price: 1 });
    }

    public async bootstrapInterviewTiers() {
        const existingTiers = await SubscriptionPlan.find({
            isActive: true,
            type: 'job-seeker',
            maxScheduleDays: { $gt: 0 }
        });

        if (existingTiers.length > 0) {
            return {
                created: [],
                existingCount: existingTiers.length
            };
        }

        const created = [];
        for (const tier of this.defaultInterviewTiers) {
            const tierByName = await SubscriptionPlan.findOne({ name: tier.name });
            if (tierByName) {
                const upgraded = await SubscriptionPlan.findByIdAndUpdate(
                    tierByName._id,
                    {
                        ...tier,
                        maxScheduleDays: tier.maxScheduleDays
                    },
                    { new: true }
                );
                if (upgraded) created.push(upgraded);
                continue;
            }

            const createdTier = await SubscriptionPlan.create(tier);
            created.push(createdTier);
        }

        return {
            created,
            existingCount: 0
        };
    }

    // Get wallet balance
    public async getWalletBalance(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return { balance: user.walletBalance || 0 };
    }

    // Recharge wallet (Delegates to Transaction-aware service)
    public async rechargeWallet(userId: string, amount: number) {
        const { WalletService } = require('./wallet.service');
        const walletService = new WalletService();
        const result = await walletService.topUp(userId, amount);

        return {
            message: 'Wallet recharged successfully',
            newBalance: result.balance
        };
    }

    // Purchase subscription
    public async purchaseSubscription(userId: string, planId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }

        if (!plan.isActive) {
            throw new Error('This subscription plan is no longer available');
        }

        const roleToPlanType: Record<string, string> = {
            employee: 'job-seeker',
            'job-seeker': 'job-seeker',
            employer: 'employer',
            recruiter: 'employer',
            resource: 'resource'
        };

        const expectedPlanType = roleToPlanType[user.role];
        if (expectedPlanType && plan.type !== expectedPlanType) {
            throw new Error(`Invalid plan type for role ${user.role}. Expected ${expectedPlanType} plan.`);
        }

        const currentBalance = user.walletBalance || 0;
        if (currentBalance < plan.price) {
            throw new Error(`Insufficient balance. Required: ${plan.price}, Available: ${currentBalance}`);
        }

        // Calculate expiry date
        const now = new Date();
        const expiryDate = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

        // Deduct from wallet and update subscription
        const newBalance = currentBalance - plan.price;

        const mongoose = require('mongoose');
        const session = await mongoose.startSession();
        session.startTransaction();
        const subscriptionId = new mongoose.Types.ObjectId();

        try {
            // Update user
            await User.findByIdAndUpdate(userId, {
                walletBalance: newBalance,
                activeSubscriptionId: plan._id,
                subscriptionExpiry: expiryDate
            }, { session });

            // Record transaction
            const Transaction = require('../models/transaction.model').default;
            await Transaction.create([{
                userId,
                type: 'deduction',
                amount: plan.price,
                description: `Purchase: ${plan.name} (${plan.durationDays} days) [SubscriptionId: ${String(subscriptionId)}]`,
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

        // Create certificate request only for certificate-eligible plans.
        const isCertificateEligible =
            typeof (plan as any).certificateEligible === 'boolean'
                ? (plan as any).certificateEligible
                : (plan.price > 0);

        if (isCertificateEligible) {
            try {
                const existingRequest = await CertificateRequest.findOne({ subscriptionId });
                if (!existingRequest) {
                    const certificateRequest = await CertificateRequest.create({
                        userId,
                        subscriptionId,
                        planId: plan._id,
                        role: user.role,
                        status: 'pending',
                        requestedAt: new Date()
                    });

                    await notifyAdmins(
                        'New Certificate Request',
                        `${user.name} (${user.email}) purchased ${plan.name}. Issue certificate from pending requests.`,
                        'info',
                        String(certificateRequest._id),
                        'certificate_request'
                    );
                }
            } catch (error) {
                console.error('Certificate request creation failed post-purchase:', error);
            }
        }

        return {
            message: 'Subscription purchased successfully',
            plan: {
                name: plan.name,
                durationDays: plan.durationDays,
                expiryDate: expiryDate
            },
            walletBalance: newBalance,
            certificateRequestStatus: isCertificateEligible ? 'pending' : 'not-eligible'
        };
    }

    // Purchase interview tier (separate from general subscriptions)
    public async purchaseInterviewTier(userId: string, planId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!['employee', 'job-seeker'].includes(user.role as any)) {
            throw new Error('Only employees can purchase interview tiers');
        }

        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            throw new Error('Interview tier plan not found');
        }

        if (!plan.isActive || plan.type !== 'job-seeker' || !plan.maxScheduleDays || plan.maxScheduleDays <= 0) {
            throw new Error('Invalid interview tier plan');
        }

        const currentBalance = user.walletBalance || 0;
        if (currentBalance < plan.price) {
            throw new Error(`Insufficient balance. Required: ${plan.price}, Available: ${currentBalance}`);
        }

        const now = new Date();
        const expiryDate = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
        const newBalance = currentBalance - plan.price;

        const mongoose = require('mongoose');
        const session = await mongoose.startSession();
        session.startTransaction();
        const interviewTierPurchaseId = new mongoose.Types.ObjectId();

        try {
            await User.findByIdAndUpdate(userId, {
                walletBalance: newBalance,
                interviewTierId: plan._id,
                interviewTierExpiry: expiryDate
            }, { session });

            const Transaction = require('../models/transaction.model').default;
            await Transaction.create([{
                userId,
                type: 'deduction',
                amount: plan.price,
                description: `Interview Tier: ${plan.name} (${plan.durationDays} days) [TierPurchaseId: ${String(interviewTierPurchaseId)}]`,
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
                id: plan._id,
                name: plan.name,
                maxScheduleDays: plan.maxScheduleDays,
                durationDays: plan.durationDays,
                expiryDate
            },
            walletBalance: newBalance
        };
    }

    // Check if subscription is active
    public async checkSubscriptionStatus(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!user.activeSubscriptionId || !user.subscriptionExpiry) {
            return {
                isActive: false,
                message: 'No active subscription'
            };
        }

        const now = new Date();
        const isActive = user.subscriptionExpiry > now;

        if (!isActive) {
            // Clear expired subscription
            await User.findByIdAndUpdate(userId, {
                activeSubscriptionId: undefined,
                subscriptionExpiry: undefined
            });
        }

        return {
            isActive,
            expiryDate: user.subscriptionExpiry,
            message: isActive ? 'Subscription is active' : 'Subscription has expired'
        };
    }

    // ========== ADMIN ONLY METHODS ==========

    // Create new subscription plan
    public async createPlan(planData: any) {
        const existingPlan = await SubscriptionPlan.findOne({ name: planData.name });
        if (existingPlan) {
            throw new Error('A plan with this name already exists');
        }

        const normalized = this.normalizePlanNumbers(planData);
        const normalizedData = {
            ...planData,
            price: normalized.price,
            durationDays: normalized.durationDays,
            razorpayPlanId: typeof planData.razorpayPlanId === 'string' ? planData.razorpayPlanId.trim() : planData.razorpayPlanId
        };

        if (normalizedData.price > 0 && !normalizedData.razorpayPlanId) {
            normalizedData.razorpayPlanId = await this.createRazorpayPlanForBilling({
                name: normalizedData.name,
                price: normalizedData.price,
                durationDays: normalizedData.durationDays,
                description: normalizedData.description
            });
        }

        if (normalizedData.price <= 0) {
            normalizedData.razorpayPlanId = undefined;
        }

        const plan = await SubscriptionPlan.create(normalizedData);
        return plan;
    }

    // Update subscription plan
    public async updatePlan(planId: string, updateData: any) {
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }

        const currentRazorpayPlanId = (plan.razorpayPlanId || '').trim();
        const incomingRazorpayPlanIdRaw =
            typeof updateData.razorpayPlanId === 'string' ? updateData.razorpayPlanId.trim() : undefined;

        const mergedPlan = {
            name: typeof updateData.name === 'string' ? updateData.name : plan.name,
            price: typeof updateData.price !== 'undefined' ? Number(updateData.price) : plan.price,
            durationDays: typeof updateData.durationDays !== 'undefined' ? Number(updateData.durationDays) : plan.durationDays,
            description: typeof updateData.description === 'string' ? updateData.description : plan.description
        };

        const billingChanged =
            mergedPlan.price !== plan.price ||
            mergedPlan.durationDays !== plan.durationDays;

        const adminProvidedDifferentPlanId =
            typeof incomingRazorpayPlanIdRaw === 'string' &&
            incomingRazorpayPlanIdRaw.length > 0 &&
            incomingRazorpayPlanIdRaw !== currentRazorpayPlanId;

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

        const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
            planId,
            updateData,
            { new: true, runValidators: true }
        );

        return updatedPlan;
    }

    // Delete subscription plan (soft delete)
    public async deletePlan(planId: string) {
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }

        // Soft delete by setting isActive to false
        await SubscriptionPlan.findByIdAndUpdate(planId, { isActive: false });
        return { message: 'Plan deleted successfully' };
    }
}
