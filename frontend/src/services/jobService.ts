/**
 * Job Service
 * Handles all job-related API calls
 */

import apiClient, { getErrorMessage } from '../lib/apiConfig';
import type { Job } from '../types';

export interface JobFilters {
    location?: string;
    type?: string;
    experience?: string;
    salary?: string;
    category?: string;
    search?: string;
}

export const jobService = {
    /**
     * Get all jobs with optional filters
     */
    async getAllJobs(filters?: JobFilters): Promise<Job[]> {
        try {
            const response = await apiClient.get<any>('/jobs', {
                params: filters,
            });
            const jobs = response.data.data || [];
            return jobs.map((job: any) => ({
                ...job,
                id: job.id || job._id
            }));
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Get job by ID
     */
    async getJobById(id: string): Promise<Job> {
        try {
            const response = await apiClient.get<Job>(`/jobs/${id}`);
            const job = response.data;
            return {
                ...job,
                id: (job as any).id || (job as any)._id
            };
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Create new job (Recruiter only)
     */
    async createJob(jobData: Partial<Job>): Promise<{ message: string; job: Job }> {
        try {
            const response = await apiClient.post('/jobs', jobData);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Update job
     */
    async updateJob(id: string, jobData: Partial<Job>): Promise<{ message: string; job: Job }> {
        try {
            const response = await apiClient.put(`/jobs/${id}`, jobData);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Delete job
     */
    async deleteJob(id: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.delete(`/jobs/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    /**
     * Get my job listings (Recruiter only)
     */
    async getMyListings(): Promise<Job[]> {
        try {
            const response = await apiClient.get<any>('/jobs/my-listings');
            const jobs = response.data.data || [];
            return jobs.map((job: any) => ({
                ...job,
                id: job.id || job._id
            }));
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },
};
