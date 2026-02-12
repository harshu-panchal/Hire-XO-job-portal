import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { subscriptionService } from "../services/subscriptionService";
import { initializeNotifications } from "../lib/notifications";
import type { User, UserRole, LoginCredentials, SignupData } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (profileData: any) => Promise<void>;
  clearError: () => void;

  // Subscription
  purchaseSubscription: (planId: string) => Promise<void>;
  checkSubscription: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Initialize push notifications after successful login
          initializeNotifications().catch(err =>
            console.error('Failed to initialize notifications:', err)
          );
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Login failed",
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      signup: async (data: SignupData, role: UserRole) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signup(data, role);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Initialize push notifications after successful signup
          initializeNotifications().catch(err =>
            console.error('Failed to initialize notifications:', err)
          );
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Signup failed",
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // Even if logout fails on backend, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        // Check if we have a valid token
        if (!authService.isAuthenticated()) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // Token is invalid or expired, clear auth state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...updates } });
      },

      updateProfile: async (profileData: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updateProfile(profileData);
          set({
            user: response.user,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Profile update failed",
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      purchaseSubscription: async (planId: string) => {
        const { user } = get();
        if (!user) throw new Error("User not authenticated");

        set({ isLoading: true, error: null });
        try {
          await subscriptionService.purchaseSubscription(planId);

          // Refresh user data to get updated subscription
          const updatedUser = await authService.getCurrentUser();
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Subscription purchase failed",
          });
          throw error;
        }
      },

      checkSubscription: () => {
        const { user } = get();
        // Backend stores subscriptionExpiry at root level of user document
        if (!user?.subscriptionExpiry) return false;

        const expiryDate = new Date(user.subscriptionExpiry);
        const now = new Date();
        return expiryDate > now;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
