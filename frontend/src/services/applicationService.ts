/**
 * Application Service
 * Handles job and resource application API calls
 */

import apiClient, { getErrorMessage } from '../lib/apiConfig';

export interface Application {
    id: string;
    jobId?: string;
    resourceId?: string;
    resourceType?: string;
    appliedAt: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    coverLetter?: string;
    [key: string]: any;
}

export const applicationService = {
    /**
     * Apply to a job
     */
    async applyToJob(jobId: string, applicationData: any): Promise<{ message: string; application: Application }> {
        try {
            const response = await apiClient.post(`/applications/jobs/${jobId}/apply`, applicationData);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Apply to a resource
     */
    async applyToResource(
        resourceType: string,
        resourceId: string,
        applicationData: any
    ): Promise<{ message: string; application: Application }> {
        try {
            const response = await apiClient.post(
                `/applications/resources/${resourceType}/${resourceId}/apply`,
                applicationData
            );
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Get my applications
     */
    async getMyApplications(): Promise<Application[]> {
        try {
            const response = await apiClient.get<Application[]>('/applications/my-applications');
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Get applications for a specific job (Recruiter only)
     */
    async getJobApplications(jobId: string): Promise<Application[]> {
        try {
            const response = await apiClient.get<Application[]>(`/applications/jobs/${jobId}/applications`);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Get applications for a specific resource
     */
    async getResourceApplications(resourceType: string, resourceId: string): Promise<Application[]> {
        try {
            const response = await apiClient.get<Application[]>(
                `/applications/resources/${resourceType}/${resourceId}/applications`
            );
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Update application status
     */
    async updateApplicationStatus(
        applicationId: string,
        status: 'Pending' | 'Accepted' | 'Rejected'
    ): Promise<{ message: string; application: Application }> {
        try {
            const response = await apiClient.put(`/applications/${applicationId}/status`, { status });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
};
