/**
 * User Service
 * Handles user profile and dashboard operations
 */

import apiClient, { getErrorMessage } from '../lib/apiConfig';

export interface DashboardStats {
    totalApplications?: number;
    pendingApplications?: number;
    acceptedApplications?: number;
    totalJobs?: number;
    totalViews?: number;
    [key: string]: any;
}

export const userService = {
    /**
     * Get dashboard statistics
     */
    async getDashboardStats(): Promise<DashboardStats> {
        try {
            const response = await apiClient.get<DashboardStats>('/users/stats');
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Update profile photo
     */
    async updateProfilePhoto(file: File): Promise<{ message: string; photoUrl: string }> {
        try {
            const formData = new FormData();
            formData.append('photo', file);

            const response = await apiClient.patch('/users/profile-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Add bookmark (save job/resource)
     */
    async addBookmark(resourceId: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.post(`/resources/${resourceId}/bookmark`);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Remove bookmark
     */
    async removeBookmark(resourceId: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.delete(`/resources/${resourceId}/bookmark`);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Update user profile information
     */
    async updateProfile(profileData: any): Promise<{ message: string; user: any }> {
        try {
            const response = await apiClient.patch('/users/profile', profileData);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
};
