import Joi from 'joi';
import PostStatus from '../../types/EnumPostStatus';
import ApplyStatus from '../../types/EnumApplicationStatus';

const JobManagementValidate = {

    recruiterIdPostIdSchema: () => {
        return Joi.object({
            userId: Joi.string().required(),
            jobPostId: Joi.string().optional()
        });
    },

    candidateIdSchema: () => {
        return Joi.object({
            userId: Joi.string().required(),
            jobPostId: Joi.string().required()
        });
    },

    jobPostIdSchema: () => {
        return Joi.object({
            jobPostId: Joi.string().required()
        });
    },

    jobSavedIdSchema: () => {
        return Joi.object({
            jobSavedId: Joi.string().required()
        });
    },

    findByJobPositionSchema: () => {
        return Joi.object({
            keySearch: Joi.string().required()
        });
    },

    filterByLocationSchema: () => {
        return Joi.object({
            locationSelection: Joi.string().required()
        });
    },

    filterByIndustrySchema: () => {
        return Joi.object({
            industrySelection: Joi.string().required()
        });
    },

    createJobPostingSchema: () => {
        return Joi.object({
            userId: Joi.string().required(),
            jobTitle: Joi.string().required(),
            jobImage: Joi.string().optional(),
            typeOfWork: Joi.string().required(),
            location: Joi.string().required(),
            jobSalary: Joi.string().required(),
            candidatesLimit: Joi.number().required(),
            educationRequired: Joi.string().required(),
            yearsOfExperience: Joi.string().required(),
            typeOfIndustry: Joi.string().required(),
            professionalSkills: Joi.string().required(),
            certificateRequired: Joi.string().optional(),
            languagesRequired: Joi.array().items(
                Joi.object({
                    language: Joi.string().required(),
                    level: Joi.string().required()
                })
            ).optional(),
            jobBenefit: Joi.string().optional(),
            jobDescription: Joi.string().required(),
            jobSchedule: Joi.string().optional(),
            applicationDeadline: Joi.date().required(),
            leavePolicy: Joi.string().optional(),
            workEnvironment: Joi.string().optional(),
            staffLevel: Joi.string().required(),
            genderRequired: Joi.string().required()
        });
    },

    ApplyStatusSchema: () => {
        return Joi.object({
            jobPostId: Joi.string().required(),
            status: Joi.string().valid(...Object.values(ApplyStatus)).required()
        })
    },

    JobPostStatusSchema: () => {
        return Joi.object({
            jobPostId: Joi.string().required(),
            postStatus: Joi.string().valid(...Object.values(PostStatus)).required()
        })
    }
};

export default JobManagementValidate;
