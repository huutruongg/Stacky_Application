import { z } from 'zod';

// Class chứa các schema validation
export class SchemaValidations {
    // Schema cho cập nhật candidate
    static candidateUpdateSchema = z.object({
        fullName: z.string().optional(),
        jobPosition: z.string().optional(),
        publicEmail: z.string().email().optional(),
        phoneNumber: z.string().min(10).max(15).optional(),
        gender: z.boolean().optional(),
        birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }).optional(),
        avatarUrl: z.string().url().optional(),
        address: z.string().optional(),
        linkedinUrl: z.string().url().optional(),
        githubUrl: z.string().url().optional(),
        personalDescription: z.string().optional(),
        languages: z.array(
            z.object({
                language: z.string(),
                level: z.enum(["Fluent", "Intermediate", "Basic"]),
            })
        ).optional(),
        projects: z.array(
            z.object({
                projectName: z.string(),
                projectTime: z.string(),
                urlRepo: z.string().url(),
                projectDescription: z.string(),
            })
        ).optional(),
        certifications: z.array(
            z.object({
                certificateName: z.string(),
                dateOfReceipt: z.string().refine((val) => !isNaN(Date.parse(val)), {
                    message: "Invalid date format",
                }),
                certificateDetail: z.string(),
            })
        ).optional(),
        programmingSkills: z.string().optional(),
        educations: z.array(
            z.object({
                schoolName: z.string(),
                startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
                    message: "Invalid date format",
                }),
                finishDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
                    message: "Invalid date format",
                }),
                fieldName: z.string(),
            })
        ).optional(),
        experiences: z.array(
            z.object({
                companyName: z.string(),
                startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
                    message: "Invalid date format",
                }),
                endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
                    message: "Invalid date format",
                }),
                jobPosition: z.string(),
                previousJobDetails: z.string(),
            })
        ).optional(),
    });

    // Phương thức validate candidate update
    static validateCandidateUpdate(data: any) {
        return this.candidateUpdateSchema.parse(data);
    }
}

