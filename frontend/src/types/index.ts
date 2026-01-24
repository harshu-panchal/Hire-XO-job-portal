export const TYPES_LOADED = true;

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary: string;
  type: "Full-time" | "Part-time" | "Contract" | "Freelance";
  postedAt: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  category: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  features: string[];
}

export interface Certificate {
  id: string;
  name: string;
  issueDate: string;
  expiryDate: string;
  successRate: number;
  status: "Active" | "Expired";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "job-seeker" | "recruiter" | "admin";
  interviewSuccessRate: number;
  activeSubscriptionId?: string;
}

export type ResourceCategory =
  | "Tenders"
  | "Logistics"
  | "Equipments"
  | "Vehicles"
  | "PMC"
  | "CSM";

export interface Resource {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  compensation: string; // Can be salary, rate, or project value
  type: "Contract" | "Temporary" | "Project-based" | "Rental";
  postedAt: string;
  category: ResourceCategory;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  duration?: string; // For contracts/projects
  urgency?: "Immediate" | "Within Week" | "Flexible";
}

export interface ResourceApplication {
  id: string;
  resourceId: string;
  appliedAt: string;
  status: "Pending" | "Accepted" | "Rejected";
}
