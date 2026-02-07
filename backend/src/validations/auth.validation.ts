import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    role: Joi.string().valid('employee', 'employer', 'resource', 'admin').default('employee'),
    // Optional fields that might be sent during registration
    phone: Joi.string().optional(),
    companyName: Joi.string().optional()
});

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
    skills: Joi.array().items(Joi.string()).optional(),
    experience: Joi.array().optional(),
    education: Joi.array().optional()
}).unknown(true); // Allow other fields that might be in the profile
