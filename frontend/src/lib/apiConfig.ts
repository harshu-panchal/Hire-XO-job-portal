/**
 * API Configuration
 * Centralized axios instance with interceptors for authentication and error handling
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenManager } from "./tokenManager";

// Create axios instance with base configuration
const apiClient = axios.create({
  // If env var is not set, default to the production API.
  // This ensures calls like "/auth/login" resolve to:
  // https://hirexo.in/api/auth/login
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://hirexo.in/api",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically attach JWT token to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle common error scenarios
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful response data
    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data || {};

      switch (status) {
        case 400:
          // Bad Request
          const errorMsg = (error.response?.data as any)?.message || "Invalid data";
          const errorDetails = (error.response?.data as any)?.error;
          console.error("Bad Request:", errorMsg, errorDetails ? errorDetails : "");
          break;

        case 401: {
          // Unauthorized - token expired or invalid
          console.error("Unauthorized access - redirecting to login");

          // Don't redirect if it's a login attempt (invalid credentials)
          if (error.config?.url?.includes("/auth/login")) {
            break;
          }

          tokenManager.removeToken();

          // Determine appropriate login path based on user role, if available
          const userFromToken = tokenManager.getUserFromToken();
          let loginPath = "/";

          if (userFromToken?.role) {
            const role = userFromToken.role;
            if (role === "employee") {
              loginPath = "/login/employee";
            } else if (role === "employer") {
              loginPath = "/login/employer";
            } else if (role === "resource") {
              loginPath = "/login/resource";
            } else if (role === "admin") {
              loginPath = "/login/admin";
            }
          }

          // Only redirect if not already on a login page
          if (!window.location.pathname.includes("/login")) {
            window.location.href = loginPath;
          }
          break;
        }

        case 403:
          // Forbidden - insufficient permissions or subscription issues
          if (data.code === "SUBSCRIPTION_EXPIRED") {
            console.error("Subscription expired - redirecting to subscription page");

            const userFromToken = tokenManager.getUserFromToken();
            let subscriptionPath = "/subscriptions";

            if (userFromToken?.role === "employer") {
              subscriptionPath = "/employer/subscription";
            }

            if (window.location.pathname !== subscriptionPath) {
              window.location.href = subscriptionPath;
            }
          } else {
            console.error("Access forbidden - insufficient permissions");
          }
          break;

        case 404:
          // Not found
          console.error("Resource not found");
          break;

        case 500:
          // Server error
          console.error("Server error - please try again later");
          break;

        default:
          console.error(`API Error: ${status}`);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error - please check your connection");
    } else {
      // Something else happened
      console.error("Request error:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to extract error message from API response
 * Supports new standardized format: { message, errors: [{field, message}] }
 */
export const getErrorMessage = (error: any): string => {
  const fieldErrors = error.response?.data?.errors;
  if (Array.isArray(fieldErrors) && fieldErrors.length > 0 && fieldErrors[0]?.message) {
    return fieldErrors[0].message;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

/**
 * Helper function to extract field-level errors from API response
 * Returns array of { field, message } objects for validation errors
 * 
 * Usage:
 *   const fieldErrors = getFieldErrors(error);
 *   fieldErrors.forEach(err => showErrorNearField(err.field, err.message));
 */
export const getFieldErrors = (error: any): Array<{ field: string; message: string }> => {
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors;
  }
  return [];
};

/**
 * Check if error has field-level validation errors
 */
export const hasFieldErrors = (error: any): boolean => {
  return getFieldErrors(error).length > 0;
};

export default apiClient;
