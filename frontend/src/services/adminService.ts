/**
 * Admin Service
 * Handles admin-only operations
 */

import apiClient, { getErrorMessage } from "../lib/apiConfig";
import type { User, SubscriptionPlan, Certificate } from "../types";

export interface SystemStats {
  users: {
    total: number;
    byRole: { [key: string]: number };
  };
  jobs: {
    total: number;
    active: number;
  };
  applications: {
    total: number;
    jobs: number;
    resources: number;
  };
  revenue: {
    total: number;
  };
  resources: {
    total: number;
    [key: string]: number;
  };
  charts: {
    revenue: { name: string; value: number }[];
    userGrowth: { name: string; users: number }[];
  };
  recentActivity: {
    id: string;
    action: string;
    user: string;
    time: string;
    type: string;
  }[];
  topEmployers: {
    name: string;
    jobs: number;
    hires: number;
  }[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const adminService = {
  /**
   * Get all users with pagination
   */
  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    try {
      const response = await apiClient.get<PaginatedResponse<User>>("/admin/users", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update user status
   */
  async updateUserStatus(
    userId: string,
    status: "active" | "suspended" | "banned"
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.patch(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update user details
   */
  async updateUser(id: string, userData: Partial<User>): Promise<{ message: string; data: User }> {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create new user
   */
  async createUser(userData: any): Promise<{ message: string; data: User }> {
    try {
      const response = await apiClient.post("/admin/users", userData);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get system statistics
   */
  async getSystemStats(): Promise<SystemStats> {
    try {
      const response = await apiClient.get<any>("/admin/stats");
      return response.data.stats;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all subscription plans
   */
  async getPlans(type?: string): Promise<SubscriptionPlan[]> {
    try {
      const response = await apiClient.get<SubscriptionPlan[]>("/subscriptions/plans", {
        params: { type },
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create subscription plan
   */
  async createPlan(
    planData: Partial<SubscriptionPlan>
  ): Promise<{ message: string; plan: SubscriptionPlan }> {
    try {
      const response = await apiClient.post("/admin/plans", planData);
      return {
        message: response.data.message,
        plan: response.data.data
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update subscription plan
   */
  async updatePlan(
    id: string,
    planData: Partial<SubscriptionPlan>
  ): Promise<{ message: string; plan: SubscriptionPlan }> {
    try {
      const response = await apiClient.put(`/admin/plans/${id}`, planData);
      return {
        message: response.data.message,
        plan: response.data.data
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete subscription plan
   */
  async deletePlan(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/admin/plans/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all certificates
   */
  async getAllCertificates(params?: { status?: string; search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Certificate>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Certificate>>("/admin/certificates", { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Approve certificate
   */
  async approveCertificate(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.patch(`/admin/certificates/${id}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Reject certificate
   */
  async rejectCertificate(id: string, reason: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.patch(`/admin/certificates/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get resources by category
   */
  async getResources(category: string, params?: any): Promise<any> {
    try {
      const response = await apiClient.get(`/admin/resources/${category}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update resource
   */
  async updateResource(category: string, id: string, data: any): Promise<any> {
    try {
      const response = await apiClient.put(`/admin/resources/${category}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete resource
   */
  async deleteResource(category: string, id: string): Promise<any> {
    try {
      const response = await apiClient.delete(`/admin/resources/${category}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all transactions
   */
  async getAllTransactions(params?: any): Promise<any> {
    try {
      const response = await apiClient.get<any>("/admin/transactions", { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
};
