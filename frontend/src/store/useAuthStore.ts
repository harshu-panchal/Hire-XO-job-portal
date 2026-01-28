import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
    User,
    UserRole,
    LoginCredentials,
    SignupData,
    JobSeekerSignupData,
    RecruiterSignupData,
    ResourceSignupData,
} from "../types";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (data: SignupData, role: UserRole) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
    updateUser: (updates: Partial<User>) => void;

    // Subscription
    purchaseSubscription: () => Promise<void>;
    checkSubscription: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true });
                try {
                    // TODO: Replace with actual API call
                    // Simulating API call
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Mock user data - in real app, this would come from backend
                    const mockUser: User = {
                        id: Math.random().toString(36).substr(2, 9),
                        email: credentials.email,
                        name: "User Name",
                        role: credentials.role,
                        profile: {
                            id: Math.random().toString(36).substr(2, 9),
                            name: "User Name",
                            email: credentials.email,
                            role: credentials.role,
                            interviewSuccessRate: 0,
                            ...(credentials.role === 'recruiter' && { walletBalance: 500 }),
                        },
                        createdAt: new Date().toISOString(),
                    };

                    set({ user: mockUser, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            signup: async (data: SignupData, role: UserRole) => {
                set({ isLoading: true });
                try {
                    // TODO: Replace with actual API call
                    // Simulating API call
                    await new Promise((resolve) => setTimeout(resolve, 1500));

                    // Create user based on role
                    let userName = "";
                    let userEmail = "";

                    if (role === "job-seeker") {
                        const jobSeekerData = data as JobSeekerSignupData;
                        userName = jobSeekerData.name;
                        userEmail = jobSeekerData.email;
                    } else if (role === "recruiter") {
                        const recruiterData = data as RecruiterSignupData;
                        userName = recruiterData.name;
                        userEmail = recruiterData.email;
                    } else if (role === "resource") {
                        const resourceData = data as ResourceSignupData;
                        userName = resourceData.name;
                        userEmail = resourceData.email;
                    }

                    const newUser: User = {
                        id: Math.random().toString(36).substr(2, 9),
                        email: userEmail,
                        name: userName,
                        role: role,
                        profile: {
                            id: Math.random().toString(36).substr(2, 9),
                            name: userName,
                            email: userEmail,
                            role: role,
                            interviewSuccessRate: 0,
                            ...(role === 'recruiter' && { walletBalance: 500 }),
                            ...(role === "job-seeker" && {
                                phoneNumber: (data as JobSeekerSignupData).phoneNumber,
                                profilePhoto: (data as JobSeekerSignupData).profilePhoto?.name,
                            }),
                            ...(role === "recruiter" && {
                                phoneNumber: (data as RecruiterSignupData).phoneNumber,
                                company: (data as RecruiterSignupData).company,
                                companyLogo: (data as RecruiterSignupData).companyLogo.name,
                            }),
                            ...(role === "resource" && {
                                phoneNumber: (data as ResourceSignupData).phoneNumber,
                                company: (data as ResourceSignupData).organizationName,
                                resourceCategory: (data as ResourceSignupData).category,
                                investorType: (data as ResourceSignupData).investorType,
                                tenderType: (data as ResourceSignupData).tenderType,
                                equipmentType: (data as ResourceSignupData).equipmentType,
                                machineryType: (data as ResourceSignupData).machineryType,
                                pmcType: (data as ResourceSignupData).pmcType,
                                csmType: (data as ResourceSignupData).csmType,
                                logisticsType: (data as ResourceSignupData).logisticsType,
                                vehicleType: (data as ResourceSignupData).vehicleType,
                            }),
                        },
                        createdAt: new Date().toISOString(),
                    };

                    set({ user: newUser, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
            },

            checkAuth: () => {
                const { user } = get();
                set({ isAuthenticated: !!user });
            },

            updateUser: (updates: Partial<User>) => {
                const { user } = get();
                if (!user) return;
                set({ user: { ...user, ...updates } });
            },

            purchaseSubscription: async () => {
                const { user } = get();
                if (!user) return;

                // Simulate API delay
                set({ isLoading: true });
                await new Promise(resolve => setTimeout(resolve, 1500));

                const sixMonthsFromNow = new Date();
                sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

                const updatedUser = {
                    ...user,
                    profile: {
                        ...user.profile,
                        subscriptionExpiry: sixMonthsFromNow.toISOString()
                    }
                };

                set({ user: updatedUser, isLoading: false });
            },

            checkSubscription: () => {
                const { user } = get();
                if (!user?.profile.subscriptionExpiry) return false;

                const expiryDate = new Date(user.profile.subscriptionExpiry);
                const now = new Date();
                return expiryDate > now;
            }
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
