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
  /**
   * Get all resources of a specific type
   */
  async getAll(resourceType: ResourceType, filters?: ResourceFilters): Promise<Resource[]> {
    try {
      const response = await apiClient.get<any>(`/${resourceType}`, {
        params: filters,
      });
      const resources = response.data.data || [];
      return resources.map((res: any) => ({
        ...res,
        id: res.id || res._id,
      }));
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
      const resource = response.data;
      return {
        ...resource,
        id: (resource as any).id || (resource as any)._id,
      };
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
  ): Promise<{ message: string; resource: Resource }> {
    try {
      const response = await apiClient.post(`/${resourceType}`, resourceData);
      return response.data;
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
  ): Promise<{ message: string; resource: Resource }> {
    try {
      const response = await apiClient.put(`/${resourceType}/${id}`, resourceData);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete resource
   */
  async delete(resourceType: ResourceType, id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/${resourceType}/${id}`);
      return response.data;
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
      const resources = response.data.data || [];
      return resources.map((res: any) => ({
        ...res,
        id: res.id || res._id,
      }));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
