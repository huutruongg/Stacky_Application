import Joi from 'joi';
import PostStatus from '../../types/EnumPostStatus';
import ApplyStatus from '../../types/EnumApplicationStatus';

const JobManagementValidate = {
    pageSchema: () => {
        return Joi.object({
            page: Joi.number().integer().min(1).required(),
            pageSize: Joi.number().integer().min(1).required()
        });
    },

    recruiterIdPostIdSchema: () => {
        return Joi.object({
            recruiterId: Joi.string().required(),
            postId: Joi.string().optional()
        });
    },

    candidateIdSchema: () => {
        return Joi.object({
            candidateId: Joi.string().required()
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
            recruiterId: Joi.string().required(),
            jobTitle: Joi.string().required(),
            jobImage: Joi.string().uri().optional(),
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
            leavePolicy: Joi.string().optional(),
            jobDescription: Joi.string().required(),
            workEnvironment: Joi.string().optional(),
            jobSchedule: Joi.string().optional(),
            applicationDeadline: Joi.date().required()
        });
    },

    ApplyStatusSchema: () => {
        return Joi.object({
            applicationId: Joi.string().required(),
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
