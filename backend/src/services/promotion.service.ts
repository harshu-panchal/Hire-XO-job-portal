import Promotion from '../models/promotion.model';
import User from '../models/user.model';
import Job from '../models/job.model';
import Post from '../models/post.model';

export class PromotionService {
    // Create a new promotion
    public async createPromotion(
        userId: string,
        resourceId: string,
        resourceType: 'Job' | 'Post',
        budget: number
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

        // Simple logic: 1 unit of currency = 1.5 estimated reach (average)
        const minReach = budget * 1.5;
        const maxReach = budget * 2.5;
        const estimatedReach = `${Math.floor(minReach)} - ${Math.floor(maxReach)} Employees`;

        const promotion = await Promotion.create({
            userId,
            resourceId,
            resourceType,
            budget,
            estimatedReach,
            status: 'Active',
            startDate: new Date()
        });

        // Simulate immediate impact on User stats (or Resource stats)
        // In a real app, this would happen over time.
        // Here we just update a "totalReach" or "walletBalance" on the user for demo.

        // deduct balance? Or just assume payment went through externally.
        // Let's increment a "profileViews" or "totalReach" counter on the user
        // We'll calculate a random number between min and max to add to the user's "reach"
        const actualReachAdded = Math.floor(Math.random() * (maxReach - minReach + 1)) + minReach;

        await User.findByIdAndUpdate(userId, {
            $inc: {
                // Assuming we track this in dashboard stats. 
                // If not, we might need to add a field or just rely on AdCampaigns aggregation.
                // For now, let's just log it or maybe update a 'reach' field if it existed.
                // "profile.reach": actualReachAdded 
            }
        });

        return promotion;
    }

    // Get promotions for a user
    public async getMyPromotions(userId: string) {
        return await Promotion.find({ userId }).sort({ createdAt: -1 });
    }

    // Get aggregate stats for promotions
    public async getPromotionStats(userId: string) {
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
