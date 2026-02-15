import apiClient, { getErrorMessage } from "@/lib/apiConfig";
import type { SubscriptionPlan } from "@/types";

export interface InterviewTier extends SubscriptionPlan {}

export const interviewTierService = {
  async getPublicTiers(): Promise<InterviewTier[]> {
    try {
      const response = await apiClient.get<InterviewTier[]>("/interview-tiers");
      return response.data || [];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async purchaseTier(tierId: string): Promise<{ message: string; tier: any; walletBalance: number }> {
    try {
      const response = await apiClient.post("/interview-tiers/purchase", { tierId });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getAdminTiers(): Promise<InterviewTier[]> {
    try {
      const response = await apiClient.get("/interview-tiers/admin");
      return response.data.data || [];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async bootstrapDefaults(): Promise<{ message: string; data: any }> {
    try {
      const response = await apiClient.post("/interview-tiers/admin/bootstrap");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async createTier(payload: Partial<InterviewTier>) {
    try {
      const response = await apiClient.post("/interview-tiers/admin", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateTier(id: string, payload: Partial<InterviewTier>) {
    try {
      const response = await apiClient.put(`/interview-tiers/admin/${id}`, payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async deleteTier(id: string) {
    try {
      await apiClient.delete(`/interview-tiers/admin/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
