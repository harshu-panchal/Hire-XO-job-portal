/**
 * Admin Service
 * Handles admin-only operations
 */

import apiClient, { getErrorMessage } from '../lib/apiConfig';
import type { User, SubscriptionPlan, Certificate } from '../types';

export interface SystemStats {
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
    totalRevenue: number;
    [key: string]: any;
}

export interface UserFilters {
    role?: string;
    status?: string;
    search?: string;
}

export const adminService = {
    /**
     * Get all users
     */
    async getUsers(filters?: UserFilters): Promise<User[]> {
        try {
            const response = await apiClient.get<User[]>('/admin/users', {
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
    async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned'): Promise<{ message: string }> {
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
     * Get system statistics
     */
    async getSystemStats(): Promise<SystemStats> {
        try {
            const response = await apiClient.get<SystemStats>('/admin/stats');
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Create subscription plan
     */
    async createPlan(planData: Partial<SubscriptionPlan>): Promise<{ message: string; plan: SubscriptionPlan }> {
        try {
            const response = await apiClient.post('/admin/plans', planData);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Update subscription plan
     */
    async updatePlan(id: string, planData: Partial<SubscriptionPlan>): Promise<{ message: string; plan: SubscriptionPlan }> {
        try {
            const response = await apiClient.put(`/admin/plans/${id}`, planData);
            return response.data;
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
    async getAllCertificates(): Promise<Certificate[]> {
        try {
            const response = await apiClient.get<Certificate[]>('/admin/certificates');
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
    async rejectCertificate(id: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.patch(`/admin/certificates/${id}/reject`);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
};
