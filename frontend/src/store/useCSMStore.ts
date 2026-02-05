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
  fetchInquiries: (serviceId: string) => Promise<void>;

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
      set((state) => ({
        myServices: [...state.myServices, response.resource],
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
      set((state) => ({
        myServices: state.myServices.map((s) => (s.id === id ? response.resource : s)),
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

  fetchInquiries: async (serviceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const inquiries = await applicationService.getResourceApplications("csm", serviceId);
      set({ inquiries, isLoading: false });
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
