import Joi from 'joi';

export const createPostSchema = Joi.object({
    content: Joi.string().required().min(10).max(5000),
    contactDetail: Joi.string().allow('', null).optional(),
    email: Joi.string().email().allow('', null).optional(),
    phoneNumber: Joi.string().allow('', null).optional(),
    resume: Joi.string().allow('', null).optional(), // URL or filename
    images: Joi.array().items(Joi.string()).optional()
});

export const updatePostSchema = Joi.object({
    content: Joi.string().min(10).max(5000),
    contactDetail: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    phoneNumber: Joi.string().allow('', null),
    resume: Joi.string().allow('', null),
    images: Joi.array().items(Joi.string())
});
