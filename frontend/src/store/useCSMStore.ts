import { create } from "zustand";
import { resourceService } from "../services/resourceService";
import { applicationService } from "../services/applicationService";
import type { Resource } from "../types";

interface CSMState {
  services: any[];
  myServices: Resource[];
  myInquiries: any[];
  inquiries: any[];
  stats: any;
  isLoading: boolean;
  filters: {
    search: string;
    type: string;
  };
  error: string | null;

  // CSM Actions
  addService: (serviceData: any) => Promise<void>; // Alias
  deleteService: (id: string) => Promise<void>; // Alias
  fetchCSMServices: (filters?: any) => Promise<void>;
  getCSMById: (id: string) => Promise<Resource | undefined>;
  createCSMService: (serviceData: Partial<Resource>) => Promise<void>;
  updateCSMService: (id: string, serviceData: Partial<Resource>) => Promise<void>;
  deleteCSMService: (id: string) => Promise<void>;
  fetchMyServices: () => Promise<void>;

  // Inquiry Actions
  fetchInquiries: (serviceId?: string) => Promise<void>;

  // Filter Actions
  setSearch: (search: string) => void;
  setType: (type: string) => void;

  // Utility
  clearError: () => void;
}

export const useCSMStore = create<CSMState>((set, get) => ({
  services: [],
  myServices: [],
  myInquiries: [], // Alias or separate?
  inquiries: [],
  stats: {
    profileViews: 0,
    avgRating: 0,
    totalReviews: 0,
  },
  isLoading: false,
  filters: {
    search: "",
    type: "all",
  },

  setSearch: (search: string) => {
    set((state) => ({
      filters: { ...state.filters, search },
    }));
  },

  setType: (type: string) => {
    set((state) => ({
      filters: { ...state.filters, type },
    }));
  },
  error: null,

  // Aliases
  addService: async (serviceData: any) => {
    return get().createCSMService(serviceData);
  },
  deleteService: async (id: string) => {
    return get().deleteCSMService(id);
  },

  fetchCSMServices: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const services = await resourceService.getAll("csm", filters);
      set({ services, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch CSM services",
        isLoading: false,
      });
    }
  },

  getCSMById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const service = await resourceService.getById("csm", id);
      set({ isLoading: false });
      return service;
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch CSM service",
        isLoading: false,
      });
      return undefined;
    }
  },

  createCSMService: async (serviceData: Partial<Resource>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resourceService.create("csm", serviceData);
      const created = (response as any).data || (response as any).resource;
      const normalized = created
        ? { ...created, id: created.id || created._id }
        : undefined;
      set((state) => ({
        myServices: normalized ? [...state.myServices, normalized] : state.myServices,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to create CSM service",
        isLoading: false,
      });
      throw error;
    }
  },

  updateCSMService: async (id: string, serviceData: Partial<Resource>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resourceService.update("csm", id, serviceData);
      const updated = (response as any).data || (response as any).resource;
      const normalized = updated
        ? { ...updated, id: updated.id || updated._id || id }
        : undefined;
      set((state) => ({
        myServices: normalized
          ? state.myServices.map((s) => (s.id === id ? normalized : s))
          : state.myServices,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to update CSM service",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCSMService: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await resourceService.delete("csm", id);
      set((state) => ({
        myServices: state.myServices.filter((s) => s.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete CSM service",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchMyServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const myServices = await resourceService.getMyListings("csm");
      set({ myServices, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch my services",
        isLoading: false,
      });
    }
  },

  fetchInquiries: async (serviceId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const inquiries = serviceId
        ? await applicationService.getResourceApplications("csm", serviceId)
        : await applicationService.getReceivedResourceApplications("csm");

      const gradientColors = [
        "from-rose-500 to-pink-600",
        "from-blue-500 to-cyan-600",
        "from-indigo-500 to-violet-600",
        "from-emerald-500 to-teal-600",
      ];

      const mappedInquiries = (Array.isArray(inquiries) ? inquiries : []).map((inquiry: any, index: number) => {
        const applicant = inquiry.applicantId || {};
        const name = applicant.name || "Unknown Applicant";
        const status = inquiry.status === "Pending" ? "New" : inquiry.status || "New";
        const appliedAt = inquiry.appliedAt ? new Date(inquiry.appliedAt) : null;
        const role =
          applicant.profile?.jobTitle ||
          applicant.profile?.role ||
          "Resource Applicant";

        return {
          ...inquiry,
          id: inquiry.id || inquiry._id,
          name,
          role,
          initial: String(name).charAt(0).toUpperCase() || "A",
          color: gradientColors[index % gradientColors.length],
          time: appliedAt ? appliedAt.toLocaleDateString() : "Recently",
          message:
            inquiry.message ||
            inquiry.coverLetter ||
            "Interested in your CSM service.",
          status,
          type: inquiry.resourceType || "CSM",
          phone: applicant.phoneNumber || "",
          email: applicant.email || "",
        };
      });

      set({
        inquiries,
        myInquiries: mappedInquiries,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch inquiries",
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
