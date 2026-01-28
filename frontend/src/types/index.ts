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
  role: "job-seeker" | "recruiter" | "resource";
  interviewSuccessRate: number;
  activeSubscriptionId?: string;
  walletBalance?: number;
  subscriptionExpiry?: string | null;
  // Additional fields for different roles
  phoneNumber?: string;
  company?: string;
  companyLogo?: string;
  profilePhoto?: string;
  resourceCategory?: ResourceCategory;
  investorType?: InvestorType;
  tenderType?: TenderType;
  equipmentType?: EquipmentType;
  machineryType?: MachineryType;
  pmcType?: PMCType;
  csmType?: CSMType;
  logisticsType?: LogisticsType;
  vehicleType?: VehicleType;
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

// Resource sub-types for each category
export type InvestorType = "want-to-invest" | "want-investment";
export type TenderType = "provide-tenders" | "apply-for-tenders";
export type EquipmentType = "rent-out-equipment" | "rent-equipment";
export type MachineryType = "provide-machinery" | "need-machinery";
export type PMCType = "offer-pmc-services" | "hire-pmc";
export type CSMType = "offer-csm-services" | "hire-csm";
export type LogisticsType = "provide-logistics" | "need-logistics";
export type VehicleType = "rent-out-vehicles" | "rent-vehicles";

// Union type for all resource sub-types
export type ResourceSubType =
  | InvestorType
  | TenderType
  | EquipmentType
  | MachineryType
  | PMCType
  | CSMType
  | LogisticsType
  | VehicleType;

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

// Authentication Types
export type UserRole = "job-seeker" | "recruiter" | "resource";

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface JobSeekerSignupData {
  name: string;
  phoneNumber: string;
  email: string;
  education: string;
  age: number;
  experience: number; // years
  interestedCompanies: string[];
  cv?: File;
  profilePhoto?: File;
  password: string;
}

export interface RecruiterSignupData {
  name: string;
  company: string;
  phoneNumber: string;
  email: string;
  companyLogo: File;
  experience: number; // years
  password: string;
}

export interface ResourceSignupData {
  name: string;
  organizationName: string;
  phoneNumber: string;
  email: string;
  category: ResourceCategory;
  // Sub-type fields for each category
  investorType?: InvestorType;
  tenderType?: TenderType;
  equipmentType?: EquipmentType;
  machineryType?: MachineryType;
  pmcType?: PMCType;
  csmType?: CSMType;
  logisticsType?: LogisticsType;
  vehicleType?: VehicleType;
  // Category-specific fields
  investmentAmount?: string; // For investors
  investmentSector?: string[]; // For investors
  equipmentTypes?: string[]; // For Equipment/Machinery
  machineryTypes?: string[]; // For Machinery
  vehicleTypes?: string[]; // For Vehicles
  serviceArea?: string; // For Logistics
  projectExperience?: number; // For PMC/CSM
  certifications?: string[]; // For PMC/CSM/Tenders
  tenderValue?: string; // For Tenders
  tenderCategory?: string[]; // For Tenders
  password: string;
}

export type SignupData = JobSeekerSignupData | RecruiterSignupData | ResourceSignupData;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile: UserProfile;
  createdAt: string;
}
