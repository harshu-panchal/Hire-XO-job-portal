/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient, { getErrorMessage } from "../lib/apiConfig";
import { tokenManager } from "../lib/tokenManager";
import type { LoginCredentials, SignupData, User, UserRole } from "../types";

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface SignupResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", credentials);

      // Store token
      if (response.data.token) {
        tokenManager.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Signup new user
   */
  async signup(data: SignupData, role: UserRole): Promise<SignupResponse> {
    try {
      // Always use FormData to match backend 'uploadMultiple' middleware expectation
      const formData = new FormData();
      formData.append("role", role);

      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          // Convert non-string values (like numbers) to string
          formData.append(key, String(value));
        }
      });

      const response = await apiClient.post<SignupResponse>("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.token) {
        tokenManager.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    const response = await apiClient.get("/auth/me");
    return response.data.user;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<{ message: string; user: User }> {
    try {
      const response = await apiClient.put("/auth/profile", data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.put("/auth/password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
      tokenManager.removeToken();
    } catch (error) {
      // Even if API call fails, remove token locally
      tokenManager.removeToken();
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isTokenValid();
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post("/auth/reset-password", {
        token,
        newPassword: password,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
