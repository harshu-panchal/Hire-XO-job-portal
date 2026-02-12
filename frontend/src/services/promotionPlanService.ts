import apiClient from '../lib/apiConfig';

export interface PromotionPlan {
    _id: string;
    name: string;
    price: number;
    duration: number;
    estimatedReachMin: number;
    estimatedReachMax: number;
    priority: number;
    features: string[];
    isMostPopular: boolean;
    isActive: boolean;
}

export const promotionPlanService = {
    // Get all active promotion plans
    async getAllPlans(): Promise<PromotionPlan[]> {
        const response = await apiClient.get('/promotion-plans/plans');
        return response.data.data;
    },

    // Admin: Create a new promotion plan
    async createPlan(planData: Omit<PromotionPlan, '_id' | 'isActive'>): Promise<PromotionPlan> {
        const response = await apiClient.post('/promotion-plans/admin/plans', planData);
        return response.data.data;
    },

    // Admin: Update a promotion plan
    async updatePlan(id: string, planData: Partial<PromotionPlan>): Promise<PromotionPlan> {
        const response = await apiClient.put(`/promotion-plans/admin/plans/${id}`, planData);
        return response.data.data;
    },

    // Admin: Delete a promotion plan
    async deletePlan(id: string): Promise<void> {
        await apiClient.delete(`/promotion-plans/admin/plans/${id}`);
    }
};
