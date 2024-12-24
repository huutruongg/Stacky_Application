import { Types } from "mongoose";
import ApplicantRepository from "../repositories/ApplicantRepository";
import { IApplicant } from "../interfaces/ICandidate";
import ApplicantDTO from "../dtos/ApplicantDTO";
import { log } from "console";
import ApplicantModel from "../models/ApplicantModel";
import CandidateModel from "../models/CandidateModel";

export default class ApplicantService {
    private applicantRepository: ApplicantRepository;

    constructor(applicantRepository: ApplicantRepository) {
        this.applicantRepository = applicantRepository;
    }

    public getCandidatesApplied = async (jobPostId: string) => {
        try {
            const sortedApplicants = await this.applicantRepository.sortedApplicants(jobPostId);
            return sortedApplicants || [];
        } catch (error) {
            console.error('Error fetching sorted applicants:', error);
            throw error;
        }
    };

    public getPotentialCandidate = async (jobPostId: string, userId: string): Promise<IApplicant | null> => {
        const data = await this.applicantRepository.findOne({ userId, jobPostId });
        return data || null;
    };

    public updateCandidatesStatus = async (jobPostId: string, userIds: string[], status: string) => {
        try {
            const objectIds = userIds.map((id) => new Types.ObjectId(id));
            const jobPostObjectId = new Types.ObjectId(jobPostId);

            const [updatedApplicants, updatedCandidates] = await Promise.all([
                ApplicantModel.updateMany(
                    { jobPostId: jobPostObjectId, userId: { $in: objectIds } },
                    { $set: { status } }
                ),
                CandidateModel.updateMany(
                    { userId: { $in: objectIds }, "jobApplied.jobPostId": jobPostObjectId },
                    { $set: { "jobApplied.$.status": status } }
                )
            ]);
            log("updatedApplicants", updatedApplicants);
            log("updatedCandidates", updatedCandidates);
            return updatedApplicants.modifiedCount > 0 || updatedCandidates.modifiedCount > 0;
        } catch (error) {
            console.error("Error updating candidate status:", error);
            return false;
        }
    };
}
