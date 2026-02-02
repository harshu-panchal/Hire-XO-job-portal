import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CSMInquiry {
    id: string;
    name: string;
    role: string;
    message: string;
    time: string;
    status: "New" | "Replied" | "Archived";
    initial: string;
    color: string;
    type: "Commercial" | "Residential" | "Infrastructure" | "Industrial";
}

export interface CSMService {
    id: string;
    title: string;
    category: string;
    views: number;
    inquiries: number;
    status: "Active" | "Under Review" | "Paused";
    postedDate: string;
}

interface CSMState {
    myServices: CSMService[];
    myInquiries: CSMInquiry[];
    stats: {
        profileViews: string;
        avgRating: string;
        totalReviews: number;
    };

    // Actions
    addService: (service: Omit<CSMService, "id" | "views" | "inquiries" | "status" | "postedDate">) => void;
    deleteService: (id: string) => void;
    updateServiceStatus: (id: string, status: CSMService["status"]) => void;
    updateInquiryStatus: (id: string, status: CSMInquiry["status"]) => void;
}

export const useCSMStore = create<CSMState>()(
    persist(
        (set) => ({
            myServices: [
                {
                    id: "csm-1",
                    title: "Expert Structural Site Supervision",
                    category: "Residential",
                    views: 320,
                    inquiries: 8,
                    status: "Active",
                    postedDate: "Jan 12, 2026",
                },
                {
                    id: "csm-2",
                    title: "Total Quality Management (TQM) Audit",
                    category: "Commercial",
                    views: 150,
                    inquiries: 4,
                    status: "Under Review",
                    postedDate: "Jan 25, 2026",
                },
            ],
            myInquiries: [
                {
                    id: "inq-1",
                    name: "Rahul Mehta",
                    role: "Property Developer",
                    message: "Need a qualified structural supervisor for our new residential project in Pune. Immediate start.",
                    time: "2h ago",
                    status: "New",
                    initial: "RM",
                    color: "from-rose-500 to-pink-600",
                    type: "Commercial"
                },
                {
                    id: "inq-2",
                    name: "Amit Khanna",
                    role: "Infrastructure Lead",
                    message: "Requesting a detailed quote for safety auditing on a bridge construction site (NH-8).",
                    time: "5h ago",
                    status: "Replied",
                    initial: "AK",
                    color: "from-pink-500 to-fuchsia-600",
                    type: "Infrastructure"
                }
            ],
            stats: {
                profileViews: "1.8k+",
                avgRating: "5.0",
                totalReviews: 12
            },

            addService: (service) => set((state) => ({
                myServices: [
                    {
                        ...service,
                        id: `csm-${Date.now()}`,
                        views: 0,
                        inquiries: 0,
                        status: "Under Review",
                        postedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    },
                    ...state.myServices
                ]
            })),

            deleteService: (id) => set((state) => ({
                myServices: state.myServices.filter(s => s.id !== id)
            })),

            updateServiceStatus: (id, status) => set((state) => ({
                myServices: state.myServices.map(s => s.id === id ? { ...s, status } : s)
            })),

            updateInquiryStatus: (id, status) => set((state) => ({
                myInquiries: state.myInquiries.map(i => i.id === id ? { ...i, status } : i)
            }))
        }),
        {
            name: "csm-storage",
        }
    )
);
