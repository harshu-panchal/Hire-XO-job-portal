import SubscriptionPlan from '../models/subscription-plan.model';
import User from '../models/user.model';

export class SubscriptionService {
    // Get all active subscription plans
    public async getAllPlans(type?: string) {
        const query: any = { isActive: true };
        if (type) query.type = type;
        const plans = await SubscriptionPlan.find(query).sort({ price: 1 });
        return plans;
    }

    // Get wallet balance
    public async getWalletBalance(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return { balance: user.walletBalance || 0 };
    }

    // Recharge wallet
    public async rechargeWallet(userId: string, amount: number) {
        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const currentBalance = user.walletBalance || 0;
        const newBalance = currentBalance + amount;

        await User.findByIdAndUpdate(userId, { walletBalance: newBalance });

        return {
            message: 'Wallet recharged successfully',
            previousBalance: currentBalance,
            amountAdded: amount,
            newBalance: newBalance
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

        const currentBalance = user.walletBalance || 0;
        if (currentBalance < plan.price) {
            throw new Error(`Insufficient balance. Required: ${plan.price}, Available: ${currentBalance}`);
        }

        // Calculate expiry date
        const now = new Date();
        const expiryDate = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

        // Deduct from wallet and update subscription
        const newBalance = currentBalance - plan.price;
        await User.findByIdAndUpdate(userId, {
            walletBalance: newBalance,
            activeSubscriptionId: plan._id,
            subscriptionExpiry: expiryDate
        });

        return {
            message: 'Subscription purchased successfully',
            plan: {
                name: plan.name,
                durationDays: plan.durationDays,
                expiryDate: expiryDate
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

        const plan = await SubscriptionPlan.create(planData);
        return plan;
    }

    // Update subscription plan
    public async updatePlan(planId: string, updateData: any) {
        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) {
            throw new Error('Subscription plan not found');
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
