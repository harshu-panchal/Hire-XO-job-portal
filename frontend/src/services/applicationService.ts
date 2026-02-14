/**
 * Application Service
 * Handles job and resource application API calls
 */

import apiClient, { getErrorMessage } from "../lib/apiConfig";

export interface Application {
  id: string;
  jobId?: string;
  resourceId?: string;
  resourceType?: string;
  appliedAt: string;
  status: "Pending" | "Accepted" | "InterviewScheduled" | "Rejected";
  coverLetter?: string;
  [key: string]: any;
}

export const applicationService = {
  /**
   * Apply to a job
   */
  async applyToJob(
    jobId: string,
    applicationData: any
  ): Promise<{ message: string; application: Application }> {
    try {
      const response = await apiClient.post(`/applications/jobs/${jobId}/apply`, applicationData);
      const data = response.data;
      return {
        ...data,
        application: {
          ...data.application,
          id: data.application.id || data.application._id,
        },
      };
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
      const data = response.data;
      return {
        ...data,
        application: {
          ...data.application,
          id: data.application.id || data.application._id,
        },
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get my applications
   */
  async getMyApplications(page: number = 1, limit: number = 20): Promise<{
    jobs: Application[];
    resources: Application[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    }
  }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        jobs: any[];
        resources: any[];
        pagination: any;
      }>("/applications/my-applications", {
        params: { page, limit }
      });

      const { jobs = [], resources = [], pagination } = response.data;

      return {
        jobs: jobs.map((app: any) => ({
          ...app,
          id: app.id || app._id,
        })),
        resources: resources.map((app: any) => ({
          ...app,
          id: app.id || app._id,
        })),
        pagination
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get applications for a specific job (Recruiter only)
   */
  async getJobApplications(jobId: string): Promise<Application[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Application[] }>(
        `/applications/jobs/${jobId}/applications`
      );
      const apps = response.data.data || [];
      return apps.map((app: any) => ({
        ...app,
        id: app.id || app._id,
      }));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all applications received across all jobs (Recruiter Dashboard)
   */
  async getReceivedApplications(): Promise<Application[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Application[] }>("/applications/received");
      const apps = response.data.data || [];
      return apps.map((app: any) => ({
        ...app,
        id: app.id || app._id,
      }));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get applications for a specific resource
   */
  async getResourceApplications(resourceType: string, resourceId: string): Promise<Application[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Application[] }>(
        `/applications/resources/${resourceType}/${resourceId}/applications`
      );
      const apps = response.data.data || [];
      return apps.map((app: any) => ({
        ...app,
        id: app.id || app._id,
      }));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all applications received for my resources
   */
  async getReceivedResourceApplications(category: string): Promise<Application[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Application[] }>("/applications/resources/received", {
        params: { category },
      });
      const apps = response.data.data || [];
      return apps.map((app: any) => ({
        ...app,
        id: app.id || app._id,
      }));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update application status
   */
  async updateApplicationStatus(
    applicationId: string,
    status: "Pending" | "Accepted" | "InterviewScheduled" | "Rejected",
    type: "job" | "resource" = "job"
  ): Promise<{ message: string; application: Application }> {
    try {
      const response = await apiClient.put(`/applications/${applicationId}/status`, {
        status,
        type,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
  /**
   * Withdraw/Delete application
   */
  async deleteApplication(applicationId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(
        `/applications/${applicationId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
