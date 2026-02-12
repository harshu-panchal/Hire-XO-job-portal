import { create } from "zustand";
import { jobService } from "../services/jobService";
import { applicationService } from "../services/applicationService";
import { userService } from "../services/userService";
import { certificateService } from "../services/certificateService";
import type { Job, Certificate } from "../types";

interface EmployeeState {
  jobs: Job[];
  savedJobs: string[];
  applications: {
    jobs: any[];
    resources: any[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    }
  };
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    type: string;
  };
  hasMore: boolean;

  // Job Actions
  fetchJobs: (filters?: any) => Promise<void>;
  getJobById: (id: string) => Promise<Job | undefined>;
  saveJob: (jobId: string) => Promise<void>;
  unsaveJob: (jobId: string) => Promise<void>;
  setSavedJobs: (jobIds: string[]) => void;
  setSearch: (search: string) => void;
  setType: (type: string) => void;

  // Application Actions
  applyToJob: (jobId: string, applicationData: any) => Promise<void>;
  fetchMyApplications: (page?: number) => Promise<void>;
  loadMoreApplications: () => Promise<void>;
  withdrawApplication: (applicationId: string) => Promise<void>;

  // Certificate Actions
  uploadCertificate: (certificateData: FormData) => Promise<void>;
  fetchCertificates: () => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  jobs: [],
  savedJobs: [],
  applications: { jobs: [], resources: [] },
  certificates: [],
  isLoading: false,
  error: null,
  filters: {
    search: "",
    type: "all",
  },
  hasMore: false,

  setSearch: (search: string) => {
    set((state) => ({
      filters: { ...state.filters, search },
    }));
  },

  setSavedJobs: (jobIds: string[]) => {
    set({ savedJobs: jobIds });
  },

  setType: (type: string) => {
    set((state) => ({
      filters: { ...state.filters, type },
    }));
  },

  fetchJobs: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const jobs = await jobService.getAllJobs(filters);
      set({ jobs, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch jobs",
        isLoading: false,
      });
    }
  },

  getJobById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const job = await jobService.getJobById(id);
      set({ isLoading: false });
      return job;
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch job",
        isLoading: false,
      });
      return undefined;
    }
  },

  saveJob: async (jobId: string) => {
    set({ error: null });
    try {
      await userService.addBookmark(jobId);
      set((state) => ({
        savedJobs: [...state.savedJobs, jobId],
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to save job" });
      throw error;
    }
  },

  unsaveJob: async (jobId: string) => {
    set({ error: null });
    try {
      await userService.removeBookmark(jobId);
      set((state) => ({
        savedJobs: state.savedJobs.filter((id) => id !== jobId),
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to unsave job" });
      throw error;
    }
  },

  applyToJob: async (jobId: string, applicationData: any) => {
    try {
      const response = await applicationService.applyToJob(jobId, applicationData);
      set((state) => ({
        applications: {
          ...state.applications,
          jobs: [...state.applications.jobs, response.application],
        },
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to apply to job",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchMyApplications: async (page: number = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await applicationService.getMyApplications(page, 10);
      set({
        applications: response,
        isLoading: false,
        hasMore: response.pagination.page < response.pagination.pages
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch applications",
        isLoading: false,
      });
    }
  },

  loadMoreApplications: async () => {
    const { applications, isLoading, hasMore } = get();
    if (isLoading || !hasMore || !applications.pagination) return;

    const nextPage = applications.pagination.page + 1;
    set({ isLoading: true });
    try {
      const response = await applicationService.getMyApplications(nextPage, 10);
      set({
        applications: {
          jobs: [...applications.jobs, ...response.jobs],
          resources: [...applications.resources, ...response.resources],
          pagination: response.pagination
        },
        isLoading: false,
        hasMore: response.pagination.page < response.pagination.pages
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to load more applications",
        isLoading: false,
      });
    }
  },

  withdrawApplication: async (applicationId: string) => {
    set({ isLoading: true, error: null });
    try {
      await applicationService.deleteApplication(applicationId);
      set((state) => ({
        applications: {
          ...state.applications,
          jobs: state.applications.jobs.filter((app) => (app.id || app._id) !== applicationId),
          resources: state.applications.resources.filter((app) => (app.id || app._id) !== applicationId),
        },
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to withdraw application",
        isLoading: false,
      });
      throw error;
    }
  },

  uploadCertificate: async (certificateData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await certificateService.uploadCertificate(certificateData);
      set((state) => ({
        certificates: [...state.certificates, response.certificate],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to upload certificate",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchCertificates: async () => {
    set({ isLoading: true, error: null });
    try {
      const certificates = await certificateService.getMyCertificates();
      set({ certificates, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch certificates",
        isLoading: false,
      });
    }
  },

  deleteCertificate: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await certificateService.deleteCertificate(id);
      set((state) => ({
        certificates: state.certificates.filter((cert) => cert.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete certificate",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
