import Joi from 'joi';

// Candidate schemas
export const CandidateValidation = {
    candidateIdSchema: Joi.object({
        userId: Joi.string().required(),
    }),

    jobIdSchema: Joi.object({
        id: Joi.string().required(),
    }),

    candidateProfessionalDetailsSchema: Joi.object({
        userId: Joi.string().required(),
        fullName: Joi.string().required(),
        jobPosition: Joi.string().required(),
        publicEmail: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        gender: Joi.boolean().required(),
        birthDate: Joi.date().required(),
        avatarUrl: Joi.string().uri().optional(),
        address: Joi.string().required(),
        githubUrl: Joi.string().uri().optional(),
        personalDescription: Joi.string().optional(),
        
        languages: Joi.array().items(
            Joi.object({
                language: Joi.string().required(),
                level: Joi.string().required()
            })
        ).required(),

        programmingSkills: Joi.string().required(),

        educations: Joi.array().items(
            Joi.object({
                schoolName: Joi.string().required(),
                startDate: Joi.date().required(),
                finishDate: Joi.date().required(),
                fieldName: Joi.string().required()
            })
        ).required()
    })
}
