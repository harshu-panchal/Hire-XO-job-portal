import Joi from 'joi';

export const createJobSchema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    company: Joi.string().min(2).max(100).optional(), // Can be auto-filled from user profile
    location: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).required(),
    requirements: Joi.array().items(Joi.string()).min(1).required(),
    salary: Joi.object({
        min: Joi.number().min(0).required(),
        max: Joi.number().min(Joi.ref('min')).required(),
        currency: Joi.string().default('INR')
    }).required(),
    type: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').required(),
    experienceLevel: Joi.string().valid('Entry', 'Mid', 'Senior').optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    deadline: Joi.date().greater('now').optional()
});

export const updateJobSchema = Joi.object({
    title: Joi.string().min(5).max(100).optional(),
    company: Joi.string().min(2).max(100).optional(),
    location: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(10).optional(),
    requirements: Joi.array().items(Joi.string()).min(1).optional(),
    salary: Joi.object({
        min: Joi.number().min(0).optional(),
        max: Joi.number().min(Joi.ref('min')).optional(),
        currency: Joi.string().optional()
    }).optional(),
    type: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').optional(),
    experienceLevel: Joi.string().valid('Entry', 'Mid', 'Senior').optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    deadline: Joi.date().greater('now').optional(),
    status: Joi.string().valid('open', 'closed').optional()
}).min(1); // Require at least one field to update
