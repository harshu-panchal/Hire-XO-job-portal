import Promotion from '../models/promotion.model';
import User from '../models/user.model';
import Job from '../models/job.model';
import Post from '../models/post.model';
import PromotionPlan from '../models/promotion-plan.model';
import { PromotionExpiryUtil } from '../utils/promotion-expiry.util';

export class PromotionService {
    // Create a new promotion with plan-based logic
    public async createPromotion(
        userId: string,
        resourceId: string,
        resourceType: 'Job' | 'Post',
        planId: string
    ) {
        // 1. Verify Ownership
        if (resourceType === 'Job') {
            const job = await Job.findById(resourceId);
            if (!job) throw new Error('Job not found');
            if (job.userId.toString() !== userId) {
                throw new Error('You can only promote your own jobs');
            }
        } else if (resourceType === 'Post') {
            const post = await Post.findById(resourceId);
            if (!post) throw new Error('Post not found');
            if (post.userId.toString() !== userId) {
                throw new Error('You can only promote your own posts');
            }
        } else {
            throw new Error('Invalid resource type');
        }

        // 2. Fetch and validate promotion plan
        const plan = await PromotionPlan.findById(planId);
        if (!plan) {
            throw new Error('Promotion plan not found');
        }
        if (!plan.isActive) {
            throw new Error('This promotion plan is no longer available');
        }

        // 3. Check for overlapping active promotions
        // First expire any expired promotions for this resource
        await PromotionExpiryUtil.getActivePromotionForResource(resourceId, resourceType);

        // Then check if there's still an active promotion
        const now = new Date();
        const existingPromotion = await Promotion.findOne({
            resourceId,
            resourceType,
            status: 'Active',
            endDate: { $gte: now }
        });

        if (existingPromotion) {
            throw new Error('This resource already has an active promotion. Please wait for it to expire before creating a new one.');
        }

        // 4. Calculate dates
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + plan.duration);

        // 5. Format estimated reach
        const estimatedReach = `${plan.estimatedReachMin} - ${plan.estimatedReachMax} Employees`;

        // 6. Create promotion
        const promotion = await Promotion.create({
            userId,
            resourceId,
            resourceType,
            planId: plan._id,
            budget: plan.price, // Store plan price for backward compatibility
            priority: plan.priority, // Copy priority from plan (higher = more visible)
            estimatedReach,
            status: 'Active',
            startDate,
            endDate
        });

        return promotion;
    }

    // Get promotions for a user
    public async getMyPromotions(userId: string) {
        // Expire old promotions first (idempotent)
        await PromotionExpiryUtil.checkAndExpirePromotions();

        return await Promotion.find({ userId })
            .populate('planId')
            .sort({ createdAt: -1 });
    }

    // Get aggregate stats for promotions
    public async getPromotionStats(userId: string) {
        // Expire old promotions first (idempotent)
        await PromotionExpiryUtil.checkAndExpirePromotions();

        const promotions = await Promotion.find({ userId });
        const totalSpent = promotions.reduce((acc, curr) => acc + curr.budget, 0);
        const activePromotions = promotions.filter(c => c.status === 'Active').length;

        return {
            totalPromotions: promotions.length,
            activePromotions,
            totalSpent
        };
    }
}
