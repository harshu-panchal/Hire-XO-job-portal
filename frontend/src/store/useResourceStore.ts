import { create } from "zustand";
import { resourceService, type ResourceType } from "../services/resourceService";
import { applicationService } from "../services/applicationService";
import { userService } from "../services/userService";
import type { Resource } from "../types";

interface ResourceState {
  resources: Resource[];
  myResources: Resource[];
  applications: any[];
  bookmarkedResources: string[];
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    type: string;
  };

  // Resource Actions
  fetchResources: (resourceType: ResourceType, filters?: any) => Promise<void>;
  getResourceById: (resourceType: ResourceType, id: string) => Promise<Resource | undefined>;
  createResource: (resourceType: ResourceType, resourceData: Partial<Resource>) => Promise<void>;
  updateResource: (
    resourceType: ResourceType,
    id: string,
    resourceData: Partial<Resource>
  ) => Promise<void>;
  deleteResource: (resourceType: ResourceType, id: string) => Promise<void>;
  fetchMyResources: (resourceType: ResourceType) => Promise<void>;

  // Application Actions
  applyToResource: (
    resourceType: string,
    resourceId: string,
    applicationData: any
  ) => Promise<void>;
  fetchResourceApplications: (resourceType: string, resourceId: string) => Promise<void>;

  // Filter Actions
  setSearch: (search: string) => void;
  setType: (type: string) => void;

  // Bookmark Actions
  saveResource: (id: string) => Promise<void>;
  unsaveResource: (id: string) => Promise<void>;
  toggleBookmark: (id: string) => Promise<void>;

  // Utility
  clearError: () => void;
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: [],
  myResources: [],
  applications: [],
  bookmarkedResources: [],
  isLoading: false,
  error: null,
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

  fetchResources: async (resourceType: ResourceType, filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const resources = await resourceService.getAll(resourceType, filters);
      set({ resources, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch resources",
        isLoading: false,
      });
    }
  },

  getResourceById: async (resourceType: ResourceType, id: string) => {
    set({ isLoading: true, error: null });
    try {
      const resource = await resourceService.getById(resourceType, id);
      set({ isLoading: false });
      return resource;
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch resource",
        isLoading: false,
      });
      return undefined;
    }
  },

  createResource: async (resourceType: ResourceType, resourceData: Partial<Resource>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resourceService.create(resourceType, resourceData);
      set((state) => ({
        myResources: [...state.myResources, response.resource],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to create resource",
        isLoading: false,
      });
      throw error;
    }
  },

  updateResource: async (
    resourceType: ResourceType,
    id: string,
    resourceData: Partial<Resource>
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resourceService.update(resourceType, id, resourceData);
      set((state) => ({
        myResources: state.myResources.map((r) => (r.id === id ? response.resource : r)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to update resource",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteResource: async (resourceType: ResourceType, id: string) => {
    set({ isLoading: true, error: null });
    try {
      await resourceService.delete(resourceType, id);
      set((state) => ({
        myResources: state.myResources.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete resource",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchMyResources: async (resourceType: ResourceType) => {
    set({ isLoading: true, error: null });
    try {
      const myResources = await resourceService.getMyListings(resourceType);
      set({ myResources, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch my resources",
        isLoading: false,
      });
    }
  },

  applyToResource: async (resourceType: string, resourceId: string, applicationData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await applicationService.applyToResource(
        resourceType,
        resourceId,
        applicationData
      );
      set((state) => ({
        applications: [...state.applications, response.application],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to apply to resource",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchResourceApplications: async (resourceType: string, resourceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const applications = await applicationService.getResourceApplications(
        resourceType,
        resourceId
      );
      set({ applications, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch applications",
        isLoading: false,
      });
    }
  },

  saveResource: async (id: string) => {
    set({ error: null });
    try {
      await userService.addBookmark(id);
      set((state) => ({
        bookmarkedResources: [...state.bookmarkedResources, id],
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to save resource" });
      throw error;
    }
  },

  unsaveResource: async (id: string) => {
    set({ error: null });
    try {
      await userService.removeBookmark(id);
      set((state) => ({
        bookmarkedResources: state.bookmarkedResources.filter((rid) => rid !== id),
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to unsave resource" });
      throw error;
    }
  },

  toggleBookmark: async (id: string) => {
    const { bookmarkedResources, saveResource, unsaveResource } = get();
    if (bookmarkedResources.includes(id)) {
      await unsaveResource(id);
    } else {
      await saveResource(id);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
