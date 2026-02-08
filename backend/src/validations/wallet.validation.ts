import Joi from 'joi';

export const topUpSchema = Joi.object({
    amount: Joi.number().greater(0).required().messages({
        'number.base': 'Amount must be a number',
        'number.greater': 'Amount must be greater than 0',
        'any.required': 'Amount is required'
    })
});
