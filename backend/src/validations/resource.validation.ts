import Joi from 'joi';

export const baseResourceSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(5).required(),
    location: Joi.string().min(2).max(100).required(),
    category: Joi.string().required(),
    // Allow resource-specific fields
    specifications: Joi.object().optional(),
    capacity: Joi.string().optional(),
    duration: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    available: Joi.boolean().optional(),
}).unknown(true); // Allow dynamic fields specific to each resource type

export const updateResourceSchema = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(5).optional(),
    location: Joi.string().min(2).max(100).optional(),
    category: Joi.string().optional(),
    specifications: Joi.object().optional(),
    capacity: Joi.string().optional(),
    duration: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    available: Joi.boolean().optional(),
}).min(1);
