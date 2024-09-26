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
        const jobId = req.params.id;

    }
}

export default CandidateCotroller;