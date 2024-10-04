import { Request, Response } from 'express';
import CandidateService from './candidate.service';
import { log } from 'console';
import { CandidateValidation } from '../../utils/validations/candidate.validation';
import { handleServiceResult, handleValidationError } from '../../utils/errors/handleError';

const CandidateController = {
    getCandidateById: async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate candidateId in params
            if (handleValidationError(CandidateValidation.candidateIdSchema.validate(req.params), res)) return;

            const candidateId = req.params.candidateId;
            const result = await CandidateService.getCandidateById(candidateId);

            // Handle result from service
            if (handleServiceResult(result, res, "Candidate not found!")) return;

            res.status(200).json({ success: true, result });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal server error!" });
        }
    },

    getCandidatesApplied: async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate jobId in params
            if (handleValidationError(CandidateValidation.jobIdSchema.validate(req.params), res)) return;

            const jobId = req.params.id;
            const result = await CandidateService.getCandidatesApplied(jobId);

            // Handle result from service
            if (handleServiceResult(result, res, "Candidates not found!")) return;

            res.status(200).json({ success: true, result });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal server error!" });
        }
    },

    submitProfessionalDetails: async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate professional details in body
            const { error } = CandidateValidation.candidateProfessionalDetailsSchema.validate(req.body);

            if (handleValidationError(error, res)) return;
            const { candidateId, fullName, jobPosition, publicEmail, phoneNumber, gender, birthDate, avatarUrl, address, linkedinUrl, githubUrl, personalDescription,
                languages, projects, certifications, programmingSkills, educations, experiences } = req.body;

            // Update personal and professional profiles
            const [personalProfile, professionalProfile] = await Promise.all([
                CandidateService.updateCandidatePersonalProfile(candidateId, fullName, jobPosition, publicEmail, phoneNumber, Boolean(gender), birthDate, avatarUrl, address, linkedinUrl, githubUrl, personalDescription),
                CandidateService.updateCandidateProfessionalProfile(candidateId, languages, projects, certifications, programmingSkills, educations, experiences)
            ]);

            // Handle service result
            if (!personalProfile || !professionalProfile) {
                res.status(500).json({ success: false, message: "Something went wrong!" });
                return;
            }

            res.status(200).json({ success: true, message: "Updated successfully!" });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, message: "Internal server error!" });
        }
    }
};

export default CandidateController;
