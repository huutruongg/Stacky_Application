import { Request, Response } from 'express';
import CandidateService from './candidate.service';
import { log } from 'console';

const CandidateCotroller = {
    getCandidateById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.body;
            const candidate = await CandidateService.getCandidateById(userId);
            if (!candidate) {
                res.status(500).json({ succes: false, message: "Candidate not found!" });
                return;
            }
            res.status(200).json({ succes: true, candidate });
        } catch (error) {
            log(error);
            res.status(500).json({ succes: false, message: "Internal server error!" });
        }
    },

    getCandidatesApplied: async (req: Request, res: Response): Promise<void> => {
        try {
            const jobId = req.params.id;
            const candidates = await CandidateService.getCandidatesApplied(jobId);
            if (!candidates) {
                res.status(500).json({ succes: false, message: "Candidate not found!" });
                return;
            }
            res.status(200).json({ succes: true, candidates });
        } catch (error) {
            log(error);
            res.status(500).json({ succes: false, message: "Internal server error!" });
        }
    },

    submitProfessionalDetails: async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, fullName, gender, birthDate, address, linkedinUrl, githubUrl, personalDescription, jobPosition,
                candidateId, languages, projects, certificates, programmingSkills, educations, experiences
            } = req.body;
            const personalProfile = await CandidateService.createCandidatePersonalProfile(userId, fullName, gender, birthDate, address, linkedinUrl, githubUrl, personalDescription, jobPosition);
            const professionalProfile = await CandidateService.createCandidateProfessionalProfile(candidateId, languages, projects, certificates, programmingSkills, educations, experiences);
            if (!personalProfile || !professionalProfile) {
                res.status(500).json({ succes: false, message: "Something went wrong!" });
                return;
            }
            res.status(200).json({ succes: true, message: "Updated successfully!" });
        } catch (error) {
            log(error);
            res.status(500).json({ succes: false, message: "Internal server error!" });
        }
    }
}

export default CandidateCotroller;