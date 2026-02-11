import Joi from 'joi';

export const createJobSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    company: Joi.string().min(2).max(100).optional(),
    location: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).required(),
    requirements: Joi.array().items(Joi.string()).min(1).required(),
    salary: Joi.string().optional(),
    minSalary: Joi.number().min(0).optional(),
    maxSalary: Joi.number().min(0).optional(),
    type: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance').required(),
    category: Joi.string().required(),
    experience: Joi.number().min(0).optional(),
    vacancies: Joi.number().min(1).optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    deadline: Joi.date().greater('now').optional(),
    responsibilities: Joi.array().items(Joi.string()).optional(),
    benefits: Joi.array().items(Joi.string()).optional()
});

export const updateJobSchema = Joi.object({
    title: Joi.string().min(2).max(100).optional(),
    company: Joi.string().min(2).max(100).optional(),
    location: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(10).optional(),
    requirements: Joi.array().items(Joi.string()).min(1).optional(),
    salary: Joi.string().optional(),
    minSalary: Joi.number().min(0).optional(),
    maxSalary: Joi.number().min(0).optional(),
    type: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance').optional(),
    category: Joi.string().optional(),
    experience: Joi.number().min(0).optional(),
    vacancies: Joi.number().min(1).optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    deadline: Joi.date().greater('now').optional(),
    status: Joi.string().valid('open', 'closed').optional(),
    responsibilities: Joi.array().items(Joi.string()).optional(),
    benefits: Joi.array().items(Joi.string()).optional()
}).min(1);
