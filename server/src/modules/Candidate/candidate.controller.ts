import CandidateService from './candidate.service';
import { log } from 'console';
import { handleServiceResult, handleValidationError } from '../../utils/errors/handle.error';
import { CandidateValidation } from '../../utils/validations/candidate.validation';
import { Request, Response } from 'express';

const CandidateController = {
    // Fetch candidate by ID
    getCandidateById: async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.userId;  // Extract from req.params
            const result = await CandidateService.getCandidateById(userId);

            if (!result) {
                res.status(404).json({ success: false, message: "Candidate not found!" });
                return;
            }

            res.status(200).json({ success: true, result });
        } catch (error) {
            // log(error);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: "Internal server error!" });
                return;
            }
        }
    },

    // Submit professional details
    submitProfessionalDetails: async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                userId,
                fullName,
                jobPosition,
                publicEmail,
                phoneNumber,
                gender,
                birthDate,
                avatarUrl,
                address,
                linkedinUrl,
                githubUrl,
                personalDescription,
                languages,
                projects,
                certifications,
                programmingSkills,
                educations,
                experiences
            } = req.body;  // Extract from req.body

            // Update both personal and professional profiles
            const [personalProfile, professionalProfile] = await Promise.all([
                CandidateService.updateCandidatePersonalProfile(
                    userId, fullName, jobPosition, publicEmail, phoneNumber,
                    Boolean(gender), birthDate, avatarUrl, address, linkedinUrl, githubUrl, personalDescription
                ),
                CandidateService.updateCandidateProfessionalProfile(
                    userId, languages, projects, certifications, programmingSkills, educations, experiences
                )
            ]);

            if (!personalProfile || !professionalProfile) {
                res.status(404).json({ success: false, message: "Error updating profiles!" });
                return;
            }

            res.status(200).json({ success: true, message: "Profile updated successfully!" });
        } catch (error) {
            // log(error);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: "Internal server error!" });
                return;
            }
        }
    },

    // Remove an object from array
    removeObjectFromArray: async (req: Request, res: Response): Promise<void> => {
        try {
            const { candidateId, field, objectId } = req.body;  // Extract from req.body

            const result = await CandidateService.removeObjectFromArray(candidateId, field, objectId);

            if (!result) {
                res.status(404).json({ success: false, message: "Error removing object!" });
                return;
            }

            res.status(200).json({ success: true, message: "Object removed successfully" });
        } catch (error) {
            // log(error);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: "Internal server error!" });
                return;
            }
        }
    },

    // Fetch candidates who applied for a job
    getCandidatesApplied: async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate jobId in params
            const { error } = CandidateValidation.jobIdSchema.validate(req.params);  // Validate req.params
            if (handleValidationError(error, res)) return;

            const jobId = req.params.jobId;  // Extract from req.params
            const result = await CandidateService.getCandidatesApplied(jobId);

            // Handle result from service
            if (handleServiceResult(result, res, "Candidates not found!")) return;

            res.status(200).json({ success: true, result });
        } catch (error) {
            // log(error);
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: "Internal server error!" });
                return;
            }
        }
    }
};

export default CandidateController;
