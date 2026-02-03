/**
 * API Configuration
 * Centralized axios instance with interceptors for authentication and error handling
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from './tokenManager';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    headers: {
        'Content-Type': 'application/json',
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

            switch (status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    console.error('Unauthorized access - redirecting to login');
                    tokenManager.removeToken();

                    // Only redirect if not already on login page
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/';
                    }
                    break;

                case 403:
                    // Forbidden - insufficient permissions
                    console.error('Access forbidden - insufficient permissions');
                    break;

                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;

                case 500:
                    // Server error
                    console.error('Server error - please try again later');
                    break;

                default:
                    console.error(`API Error: ${status}`);
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('Network error - please check your connection');
        } else {
            // Something else happened
            console.error('Request error:', error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * Helper function to extract error message from API response
 */
export const getErrorMessage = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

export default apiClient;
