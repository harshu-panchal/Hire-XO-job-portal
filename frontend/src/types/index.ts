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



export type ResourceCategory =
  | "Investor"
  | "Tenders"
  | "Logistics"
  | "Equipments"
  | "Machinery"
  | "Vehicles"
  | "PMC"
  | "CSM";

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  location: string;
  description: string;
  compensation?: string;
  userId: string;
  company?: string;
  postedAt?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  duration?: string;
  urgency?: string;
  [key: string]: any;
}

// Missing types
export type UserRole = "employee" | "employer" | "resource" | "admin";
export type InvestorType = string;
export type TenderType = string;
export type EquipmentType = string;
export type MachineryType = string;
export type PMCType = string;
export type CSMType = string;
export type LogisticsType = string;
export type VehicleType = string;

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
  profile: UserProfile;
  createdAt: string;
  phoneNumber?: string;
  profilePhoto?: string; // Added to fix build
  activeSubscriptionId?: string; // Added to fix build
}

export interface EmployerSignupData {
  name: string;
  username: string;
  company: string;
  phoneNumber: string;
  email: string;
  companyLogo: File;
  experience: number;
  password: string;
}

export interface EmployeeSignupData {
  name: string;
  username: string;
  phoneNumber: string;
  email: string;
  education: string;
  age: number;
  experience: number;
  interestedCompanies: string[];
  cv?: File;
  profilePhoto?: File;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
}

export type SignupData = EmployerSignupData | EmployeeSignupData | ResourceSignupData;

export interface ResourceSignupData {
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  category: ResourceCategory;
  organizationName: string;
  [key: string]: any; // For dynamic fields based on category
}

export type ResourceSubType = string;

// Update UserProfile to include missing fields
export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: "employee" | "employer" | "resource" | "admin";
  interviewSuccessRate: number;
  activeSubscriptionId?: string;
  walletBalance?: number;
  subscriptionExpiry?: string | null;
  // Additional fields for different roles
  phoneNumber?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  companyLogo?: string;
  profilePhoto?: string;
  bio?: string;
  skills?: string[];
  experience?: Array<{ company: string; role: string; period: string }> | any; // Updated to any to fix build error
  education?: Array<{ school: string; degree: string; period: string }>;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  resourceCategory?: ResourceCategory;
  category?: ResourceCategory;
  investorType?: InvestorType;
  tenderType?: TenderType;
  equipmentType?: EquipmentType;
  machineryType?: MachineryType;
  pmcType?: PMCType;
  csmType?: CSMType;
  logisticsType?: LogisticsType;
  vehicleType?: VehicleType;

  // Investor specific
  investmentRange?: string;
  preferredEquity?: string;

  // Tender specific
  website?: string;
  founded?: string;
  projectsWon?: number;
}
