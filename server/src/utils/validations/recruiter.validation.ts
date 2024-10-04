// recruiter.validation.ts
import Joi from 'joi';

export const recruiterIdValidationSchema = Joi.object({
    recruiterId: Joi.string().length(24).required(),
});
