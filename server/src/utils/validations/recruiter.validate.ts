import Joi from 'joi';

export const RecruiterValidation = {
    forgotPasswordSchema: Joi.object({
        privateEmail: Joi.string().email().required()
    }),

    resetPasswordSchema: Joi.object({
        password: Joi.string().min(6).required()
    }),

    updateCompanyContactSchema: Joi.object({
        email: Joi.string().email().required(),
        mobile: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required()
    }),

    updateCompanyProfileSchema: Joi.object({
        // Add fields needed for company profile update, with validation rules
        orgName: Joi.string().required(),
        orgField: Joi.string().required(),
        orgScale: Joi.string().required(),
        orgAddress: Joi.string().required(),
        // Other fields related to company profile
    })
};
