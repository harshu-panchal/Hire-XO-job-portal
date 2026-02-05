/**
 * Subscription Service
 * Handles subscription plans and wallet management
 */

import apiClient, { getErrorMessage } from "../lib/apiConfig";
import type { SubscriptionPlan } from "../types";

export interface WalletBalance {
  balance: number;
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan?: SubscriptionPlan;
  expiresAt?: string;
}

export const subscriptionService = {
  /**
   * Get all subscription plans
   */
  async getAllPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await apiClient.get<SubscriptionPlan[]>("/subscriptions/plans");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Purchase a subscription
   */
  async purchaseSubscription(planId: string): Promise<{ message: string; subscription: any }> {
    try {
      const response = await apiClient.post("/subscriptions/purchase", { planId });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Check subscription status
   */
  async checkSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const response = await apiClient.get<SubscriptionStatus>("/subscriptions/status");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get wallet balance
   */
  async getWalletBalance(): Promise<WalletBalance> {
    try {
      const response = await apiClient.get<WalletBalance>("/subscriptions/wallet/balance");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Recharge wallet
   */
  async rechargeWallet(amount: number): Promise<{ message: string; balance: number }> {
    try {
      const response = await apiClient.post("/subscriptions/wallet/recharge", { amount });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
