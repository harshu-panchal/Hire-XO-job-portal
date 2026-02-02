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
                    let mockUser: User;

                    if (credentials.email === "investment1@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "investor-1",
                            email: credentials.email,
                            name: "Premium Investor",
                            username: "premium_investor",
                            role: "resource",
                            profile: {
                                id: "prof-investor-1",
                                name: "Premium Investor",
                                username: "premium_investor",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 95,
                                resourceCategory: "Investor",
                                investorType: "want-to-invest",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "investment2@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "investor-2",
                            email: credentials.email,
                            name: "Startup Founder",
                            username: "startup_founder",
                            role: "resource",
                            profile: {
                                id: "prof-investor-2",
                                name: "Startup Founder",
                                username: "startup_founder",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 85,
                                resourceCategory: "Investor",
                                investorType: "want-investment",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "tender1@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "tender-1",
                            email: credentials.email,
                            name: "Tender Applicant",
                            username: "tender_applicant",
                            role: "resource",
                            profile: {
                                id: "prof-tender-1",
                                name: "Tender Applicant",
                                username: "tender_applicant",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 88,
                                resourceCategory: "Tenders",
                                tenderType: "apply-for-tenders",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "tender2@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "tender-2",
                            email: credentials.email,
                            name: "Tender Provider",
                            username: "tender_provider",
                            role: "resource",
                            profile: {
                                id: "prof-tender-2",
                                name: "Tender Provider",
                                username: "tender_provider",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 92,
                                resourceCategory: "Tenders",
                                tenderType: "provide-tenders",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "equipment1@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "equipment-1",
                            email: credentials.email,
                            name: "Equipment Renter",
                            username: "equip_renter",
                            role: "resource",
                            profile: {
                                id: "prof-equipment-1",
                                name: "Equipment Renter",
                                username: "equip_renter",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 85,
                                resourceCategory: "Equipments",
                                equipmentType: "rent-equipment",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "equipment2@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "equipment-2",
                            email: credentials.email,
                            name: "Equipment Provider",
                            username: "equip_provider",
                            role: "resource",
                            profile: {
                                id: "prof-equipment-2",
                                name: "Equipment Provider",
                                username: "equip_provider",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 90,
                                resourceCategory: "Equipments",
                                equipmentType: "rent-out-equipment",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "machinery1@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "machinery-1",
                            email: credentials.email,
                            name: "Machinery Buyer",
                            username: "machine_buyer",
                            role: "resource",
                            profile: {
                                id: "prof-machinery-1",
                                name: "Machinery Buyer",
                                username: "machine_buyer",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 87,
                                resourceCategory: "Machinery",
                                machineryType: "need-machinery",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "machinery2@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "machinery-2",
                            email: credentials.email,
                            name: "Machinery Seller",
                            username: "machine_seller",
                            role: "resource",
                            profile: {
                                id: "prof-machinery-2",
                                name: "Machinery Seller",
                                username: "machine_seller",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 93,
                                resourceCategory: "Machinery",
                                machineryType: "provide-machinery",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "pmc1@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "pmc-1",
                            email: credentials.email,
                            name: "PMC Hirer",
                            username: "pmc_hirer",
                            role: "resource",
                            profile: {
                                id: "prof-pmc-1",
                                name: "PMC Hirer",
                                username: "pmc_hirer",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 89,
                                resourceCategory: "PMC",
                                pmcType: "hire-pmc",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "pmc2@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "pmc-2",
                            email: credentials.email,
                            name: "PMC Provider",
                            username: "pmc_provider",
                            role: "resource",
                            profile: {
                                id: "prof-pmc-2",
                                name: "PMC Provider",
                                username: "pmc_provider",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 94,
                                resourceCategory: "PMC",
                                pmcType: "offer-pmc-services",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "csm1@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "csm-1",
                            email: credentials.email,
                            name: "CSM Hirer",
                            username: "csm_hirer",
                            role: "resource",
                            profile: {
                                id: "prof-csm-1",
                                name: "CSM Hirer",
                                username: "csm_hirer",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 86,
                                resourceCategory: "CSM",
                                csmType: "hire-csm",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "csm2@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "csm-2",
                            email: credentials.email,
                            name: "CSM Provider",
                            username: "csm_provider",
                            role: "resource",
                            profile: {
                                id: "prof-csm-2",
                                name: "CSM Provider",
                                username: "csm_provider",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 91,
                                resourceCategory: "CSM",
                                csmType: "offer-csm-services",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "logistics1@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "logistics-1",
                            email: credentials.email,
                            name: "Logistics Seeker",
                            username: "logistics_seeker",
                            role: "resource",
                            profile: {
                                id: "prof-logistics-1",
                                name: "Logistics Seeker",
                                username: "logistics_seeker",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 84,
                                resourceCategory: "Logistics",
                                logisticsType: "need-logistics",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "logistics2@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "logistics-2",
                            email: credentials.email,
                            name: "Logistics Provider",
                            username: "logistics_provider",
                            role: "resource",
                            profile: {
                                id: "prof-logistics-2",
                                name: "Logistics Provider",
                                username: "logistics_provider",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 95,
                                resourceCategory: "Logistics",
                                logisticsType: "provide-logistics",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "vehicle1@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "vehicle-1",
                            email: credentials.email,
                            name: "Vehicle Renter",
                            username: "vehicle_renter",
                            role: "resource",
                            profile: {
                                id: "prof-vehicle-1",
                                name: "Vehicle Renter",
                                username: "vehicle_renter",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 83,
                                resourceCategory: "Vehicles",
                                vehicleType: "rent-vehicles",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else if (credentials.email === "vehicle2@gmail.com" && credentials.password === "123456") {
                        mockUser = {
                            id: "vehicle-2",
                            email: credentials.email,
                            name: "Vehicle Provider",
                            username: "vehicle_provider",
                            role: "resource",
                            profile: {
                                id: "prof-vehicle-2",
                                name: "Vehicle Provider",
                                username: "vehicle_provider",
                                email: credentials.email,
                                role: "resource",
                                interviewSuccessRate: 96,
                                resourceCategory: "Vehicles",
                                vehicleType: "rent-out-vehicles",
                            },
                            createdAt: new Date().toISOString(),
                        };
                    } else {
                        mockUser = {
                            id: Math.random().toString(36).substr(2, 9),
                            email: credentials.email,
                            name: "User Name",
                            username: "user_" + Math.random().toString(36).substr(2, 5),
                            role: credentials.role,
                            profile: {
                                id: Math.random().toString(36).substr(2, 9),
                                name: "User Name",
                                username: "user_" + Math.random().toString(36).substr(2, 5),
                                email: credentials.email,
                                role: credentials.role,
                                interviewSuccessRate: 0,
                                ...(credentials.role === 'recruiter' && { walletBalance: 500 }),
                            },
                            createdAt: new Date().toISOString(),
                        };
                    }

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
                    let username = "";

                    if (role === "job-seeker") {
                        const jobSeekerData = data as JobSeekerSignupData;
                        userName = jobSeekerData.name;
                        userEmail = jobSeekerData.email;
                        username = jobSeekerData.username;
                    } else if (role === "recruiter") {
                        const recruiterData = data as RecruiterSignupData;
                        userName = recruiterData.name;
                        userEmail = recruiterData.email;
                        username = recruiterData.username;
                    } else if (role === "resource") {
                        const resourceData = data as ResourceSignupData;
                        userName = resourceData.name;
                        userEmail = resourceData.email;
                        username = resourceData.username;
                    }

                    const newUser: User = {
                        id: Math.random().toString(36).substr(2, 9),
                        email: userEmail,
                        name: userName,
                        username: username,
                        role: role,
                        profile: {
                            id: Math.random().toString(36).substr(2, 9),
                            name: userName,
                            username: username,
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
