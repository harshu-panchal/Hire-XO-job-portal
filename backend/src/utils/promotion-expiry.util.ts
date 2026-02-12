import Promotion from '../models/promotion.model';

/**
 * Promotion Expiry Utility
 * Handles automatic expiry of promotions in an idempotent and index-based manner
 */
export class PromotionExpiryUtil {
    /**
     * Check and expire promotions that have passed their endDate
     * This is idempotent - safe to call multiple times
     * Uses indexes for efficient querying
     */
    public static async checkAndExpirePromotions(): Promise<number> {
        try {
            const now = new Date();

            // Find all active promotions that have expired
            // Uses compound index: { status: 1, endDate: 1 }
            const result = await Promotion.updateMany(
                {
                    status: 'Active',
                    endDate: { $lt: now }
                },
                {
                    $set: { status: 'Completed' }
                }
            );

            return result.modifiedCount || 0;
        } catch (error) {
            console.error('Error expiring promotions:', error);
            return 0;
        }
    }

    /**
     * Check if a specific promotion has expired and update if needed
     * Returns true if the promotion was expired
     */
    public static async checkSinglePromotion(promotionId: string): Promise<boolean> {
        try {
            const now = new Date();

            const result = await Promotion.updateOne(
                {
                    _id: promotionId,
                    status: 'Active',
                    endDate: { $lt: now }
                },
                {
                    $set: { status: 'Completed' }
                }
            );

            return (result.modifiedCount || 0) > 0;
        } catch (error) {
            console.error('Error checking promotion expiry:', error);
            return false;
        }
    }

    /**
     * Get active promotion for a specific resource
     * Automatically expires if needed
     */
    public static async getActivePromotionForResource(
        resourceId: string,
        resourceType: 'Job' | 'Post'
    ) {
        // First, expire any expired promotions for this resource
        const now = new Date();
        await Promotion.updateMany(
            {
                resourceId,
                resourceType,
                status: 'Active',
                endDate: { $lt: now }
            },
            {
                $set: { status: 'Completed' }
            }
        );

        // Then find active promotion
        const promotion = await Promotion.findOne({
            resourceId,
            resourceType,
            status: 'Active',
            endDate: { $gte: now }
        }).populate('planId');

        return promotion;
    }
}
