/**
 * Resource Service
 * Generic service for all resource types (Investor, Tender, Equipment, etc.)
 */

import apiClient, { getErrorMessage } from "../lib/apiConfig";
import type { Resource } from "../types";

export type ResourceType =
  | "investors"
  | "tenders"
  | "equipments"
  | "machinery"
  | "pmc"
  | "csm"
  | "logistics"
  | "vehicles";

export interface ResourceFilters {
  location?: string;
  type?: string;
  compensation?: string;
  search?: string;
  [key: string]: any;
}

export const resourceService = {
  normalizeResource(raw: any): Resource {
    if (!raw || typeof raw !== "object") {
      return { id: "" } as Resource;
    }

    const resource = raw.data && typeof raw.data === "object" ? raw.data : raw;

    return {
      ...resource,
      id: resource.id || resource._id || "",
    } as Resource;
  },

  normalizeEnvelope<T = any>(payload: any): { success: boolean; message?: string; data: T } {
    if (payload && typeof payload === "object" && "data" in payload) {
      return {
        success: Boolean((payload as any).success ?? true),
        message: (payload as any).message,
        data: (payload as any).data as T,
      };
    }

    return {
      success: true,
      data: payload as T,
    };
  },

  /**
   * Get all resources of a specific type
   */
  async getAll(resourceType: ResourceType, filters?: ResourceFilters): Promise<Resource[]> {
    try {
      const response = await apiClient.get<any>(`/${resourceType}`, {
        params: filters,
      });
      const envelope = this.normalizeEnvelope<any[]>(response.data);
      const resources = Array.isArray(envelope.data) ? envelope.data : [];
      return resources.map((res: any) => this.normalizeResource(res));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get resource by ID
   */
  async getById(resourceType: ResourceType, id: string): Promise<Resource> {
    try {
      const response = await apiClient.get<Resource>(`/${resourceType}/${id}`);
      const envelope = this.normalizeEnvelope<Resource>(response.data as any);
      return this.normalizeResource(envelope.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create new resource
   */
  async create(
    resourceType: ResourceType,
    resourceData: Partial<Resource>
  ): Promise<{ success: boolean; message: string; data: Resource; resource: Resource }> {
    try {
      const response = await apiClient.post(`/${resourceType}`, resourceData);
      const envelope = this.normalizeEnvelope<Resource>(response.data);
      const resource = this.normalizeResource(envelope.data);

      return {
        success: envelope.success,
        message: envelope.message || "Resource created successfully",
        data: resource,
        resource,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update resource
   */
  async update(
    resourceType: ResourceType,
    id: string,
    resourceData: Partial<Resource>
  ): Promise<{ success: boolean; message: string; data: Resource; resource: Resource }> {
    try {
      const response = await apiClient.put(`/${resourceType}/${id}`, resourceData);
      const envelope = this.normalizeEnvelope<Resource>(response.data);
      const resource = this.normalizeResource(envelope.data);

      return {
        success: envelope.success,
        message: envelope.message || "Resource updated successfully",
        data: resource,
        resource,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete resource
   */
  async delete(resourceType: ResourceType, id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/${resourceType}/${id}`);
      const envelope = this.normalizeEnvelope<null>(response.data);
      return {
        success: envelope.success,
        message: envelope.message || "Resource deleted successfully",
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get my resource listings
   */
  async getMyListings(resourceType: ResourceType): Promise<Resource[]> {
    try {
      const response = await apiClient.get<any>(`/${resourceType}/my-listings`);
      const envelope = this.normalizeEnvelope<any[]>(response.data);
      const resources = Array.isArray(envelope.data) ? envelope.data : [];
      return resources.map((res: any) => this.normalizeResource(res));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
