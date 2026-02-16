import Joi from 'joi';

export const registerSchema = Joi.object({
    // Required fields for all users
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string().valid('employee', 'employer', 'resource', 'admin').default('employee'),

    // Common optional fields
    username: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    phone: Joi.string().optional(), // Backward compatibility

    // Employer-specific fields
    company: Joi.string().optional(),
    companyName: Joi.string().optional(),
    companyLogo: Joi.any().optional(), // File upload

    // Employee-specific fields
    education: Joi.alternatives().try(Joi.string(), Joi.array()).optional(),
    age: Joi.number().min(16).max(120).optional(),
    experience: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.array()).optional(),
    interestedCompanies: Joi.array().items(Joi.string()).single().optional(),
    cv: Joi.any().optional(), // File upload
    profilePhoto: Joi.any().optional(), // File upload

    // Resource-specific fields
    organizationName: Joi.string().optional(),
    category: Joi.string().optional(),
    investorType: Joi.string().optional(),
    tenderType: Joi.string().optional(),
    equipmentType: Joi.string().optional(),
    machineryType: Joi.string().optional(),
    pmcType: Joi.string().optional(),
    csmType: Joi.string().optional(),
    logisticsType: Joi.string().optional(),
    vehicleType: Joi.string().optional(),
    investmentAmount: Joi.string().optional(),
    investmentSector: Joi.array().items(Joi.string()).single().optional(),
    equipmentTypes: Joi.array().items(Joi.string()).single().optional(),
    machineryTypes: Joi.array().items(Joi.string()).single().optional(),
    machinerySpecs: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
    vehicleTypes: Joi.array().items(Joi.string()).single().optional(),
    serviceArea: Joi.string().optional(),
    projectExperience: Joi.number().min(0).max(100).optional(),
    certifications: Joi.array().items(Joi.string()).single().optional(),
    tenderValue: Joi.string().optional(),
    tenderCategory: Joi.array().items(Joi.string()).single().optional()
});
// Note: Removed .unknown(true) for security - all fields must be explicitly defined

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('employee', 'employer', 'resource', 'admin').required()
});

export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phoneNumber: Joi.string().optional(),
    about: Joi.string().optional(),
    location: Joi.string().optional(),
    address: Joi.string().optional(),
    skills: Joi.array().items(Joi.string()).single().optional(),
    experience: Joi.array().optional(),
    education: Joi.array().optional()
});
// Note: Removed .unknown(true) for security
