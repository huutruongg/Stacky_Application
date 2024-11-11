import Joi from 'joi';

export const UpdateCandidateProfileSchema = Joi.object({
    avatarUrl: Joi.string().uri().required().messages({
        'string.uri': 'Invalid URL',
        'any.required': 'Avatar URL is required'
    }),
    fullName: Joi.string().required().messages({
        'any.required': 'Full name is required'
    }),
    publicEmail: Joi.string().email().required().messages({
        'string.email': 'Invalid email address',
        'any.required': 'Public email is required'
    }),
    phoneNumber: Joi.string().max(10).required().messages({
        'any.required': 'Phone number is required',
        'string.max': 'Phone number must be at most 10 characters'
    }),
});

// Language Validation
const LanguageSchema = Joi.object({
    language: Joi.string().required(),
    level: Joi.string().required()
});

// Project Validation
const ProjectSchema = Joi.object({
    projectName: Joi.string().required(),
    projectTime: Joi.string().required(),
    urlRepo: Joi.string().uri().optional(),
    projectDescription: Joi.string().optional()
});

// Education Validation
const EducationSchema = Joi.object({
    schoolName: Joi.string().required(),
    startDate: Joi.date().required(),
    finishDate: Joi.date().optional(),
    fieldName: Joi.string().required()
});

// Experience Validation
const ExperienceSchema = Joi.object({
    companyName: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    jobPosition: Joi.string().optional(),
    previousJobDetails: Joi.string().optional()
});

// Certification Validation
const CertificationSchema = Joi.object({
    certificateName: Joi.string().required(),
    dateOfReceipt: Joi.date().required(),
    certificateDetail: Joi.string().required()
});

// Main Candidate Validation Schema
export const UpdateCandidateInfoSchema = Joi.object({
    publicEmail: Joi.string().email().optional(),
    phoneNumber: Joi.string().optional(),
    professionalSkills: Joi.string().optional(),
    fullName: Joi.string().optional(),
    gender: Joi.boolean().optional(),
    birthDate: Joi.date().optional(),
    avatarUrl: Joi.string().uri().optional(),
    address: Joi.string().optional(),
    linkedinUrl: Joi.string().uri().optional(),
    githubUrl: Joi.string().uri().optional(),
    personalDescription: Joi.string().optional(),
    jobPosition: Joi.string().optional(),
    languages: Joi.array().items(LanguageSchema).optional(),
    projects: Joi.array().items(ProjectSchema).optional(),
    educations: Joi.array().items(EducationSchema).optional(),
    experiences: Joi.array().items(ExperienceSchema).optional(),
    certifications: Joi.array().items(CertificationSchema).optional()
});

export const DeleteCandidateSchema = Joi.object({
    userId: Joi.string().required().messages({
        'any.required': 'User ID is required'
    })
})