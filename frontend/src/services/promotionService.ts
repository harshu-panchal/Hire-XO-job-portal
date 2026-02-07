import apiClient, { getErrorMessage } from "../lib/apiConfig";

export interface Promotion {
    _id: string;
    resourceId: string;
    resourceType: 'Job' | 'Post';
    budget: number;
    estimatedReach: string;
    status: 'Active' | 'Completed' | 'Paused';
    startDate: string;
    endDate?: string;
}

export interface PromotionStats {
    totalSpent: number;
    activeCount: number;
    totalReach: string;
}

export const promotionService = {
    async createPromotion(
        resourceId: string,
        resourceType: 'Job' | 'Post',
        budget: number
    ): Promise<Promotion> {
        try {
            const response = await apiClient.post<{ promotion: Promotion }>("/promotions", {
                resourceId,
                resourceType,
                budget
            });
            return response.data.promotion;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async getMyPromotions(): Promise<{ promotions: Promotion[]; stats: PromotionStats }> {
        try {
            const response = await apiClient.get<{ promotions: Promotion[]; stats: PromotionStats }>("/promotions/my-promotions");
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
