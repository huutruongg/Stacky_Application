import Joi from 'joi';

export const AuthValidation = {
    signupRecruiterSchema: Joi.object({
        privateEmail: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phoneNumber: Joi.string().required(),
        orgTaxNumber: Joi.string().required(),
        orgName: Joi.string().required(),
        orgField: Joi.string().required(),
        orgScale: Joi.string().required(),
        orgAddress: Joi.string().required()
    }),

    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
};
