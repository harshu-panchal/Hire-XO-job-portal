import { Model } from 'mongoose';
import { PromotionExpiryUtil } from './promotion-expiry.util';

/**
 * Promotion-Aware Sorting Utility
 * Provides additive feed sorting that prioritizes promoted items
 * without breaking existing filters, pagination, or search
 */
export class PromotionSortingUtil {
    /**
     * Build aggregation pipeline for promotion-aware sorting
     * CRITICAL: Higher priority number = higher visibility
     * Sort order: isPromoted (desc) → priority (desc) → startDate (desc) → createdAt (desc)
     * 
     * @param resourceType - 'Job' or 'Post'
     * @param query - MongoDB query object with filters
     * @param skip - Pagination skip
     * @param limit - Pagination limit
     * @param userSort - Optional user-requested sort (e.g., 'oldest', 'title')
     */
    public static buildPromotionAwarePipeline(
        resourceType: string,
        query: any,
        skip: number,
        limit: number,
        userSort?: string
    ) {
        const now = new Date();

        const pipeline: any[] = [
            // Match the query filters (ADDITIVE - preserves existing logic)
            { $match: query },

            // Lookup active promotions
            {
                $lookup: {
                    from: 'promotions',
                    let: { resourceId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$resourceId', '$$resourceId'] },
                                        { $eq: ['$resourceType', resourceType] },
                                        { $eq: ['$status', 'Active'] },
                                        { $gte: ['$endDate', now] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'activePromotion'
                }
            },

            // Add computed fields for sorting
            {
                $addFields: {
                    isPromoted: { $gt: [{ $size: '$activePromotion' }, 0] },
                    promotionPriority: {
                        $ifNull: [
                            { $arrayElemAt: ['$activePromotion.priority', 0] },
                            0
                        ]
                    },
                    promotionStartDate: {
                        $ifNull: [
                            { $arrayElemAt: ['$activePromotion.startDate', 0] },
                            new Date(0)
                        ]
                    }
                }
            },

            // CRITICAL: Promotion-aware sorting
            // Higher priority number = higher visibility (10 > 5 > 3)
            {
                $sort: {
                    isPromoted: -1,              // Promoted items first
                    promotionPriority: -1,       // Higher priority first
                    promotionStartDate: -1,      // Newer promotions first
                    createdAt: -1                // Fallback to creation date
                }
            }
        ];

        // Apply user-requested sort if specified (additive, but after promotion sort)
        // Note: This may override the default createdAt sort for non-promoted items
        if (userSort === 'oldest') {
            pipeline.push({
                $sort: {
                    isPromoted: -1,
                    promotionPriority: -1,
                    promotionStartDate: -1,
                    createdAt: 1  // Oldest first for non-promoted
                }
            });
        } else if (userSort === 'title') {
            pipeline.push({
                $sort: {
                    isPromoted: -1,
                    promotionPriority: -1,
                    promotionStartDate: -1,
                    title: 1  // Alphabetical for non-promoted
                }
            });
        }

        // Pagination
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        // Remove temporary fields from output
        pipeline.push({
            $project: {
                activePromotion: 0,
                isPromoted: 0,
                promotionPriority: 0,
                promotionStartDate: 0
            }
        });

        return pipeline;
    }

    /**
     * Execute promotion-aware query with automatic expiry
     * 
     * @param model - Mongoose model
     * @param resourceType - 'Job' or 'Post'
     * @param query - MongoDB query object
     * @param page - Page number
     * @param limit - Items per page
     * @param userSort - Optional user sort preference
     */
    public static async executePromotionAwareQuery(
        model: Model<any>,
        resourceType: string,
        query: any,
        page: number = 1,
        limit: number = 20,
        userSort?: string
    ) {
        // Expire old promotions first (idempotent, index-based)
        await PromotionExpiryUtil.checkAndExpirePromotions();

        const skip = (page - 1) * limit;

        const pipeline = this.buildPromotionAwarePipeline(
            resourceType,
            query,
            skip,
            limit,
            userSort
        );

        const items = await model.aggregate(pipeline);
        const total = await model.countDocuments(query);

        return {
            items,
            total,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
}
