import { Types } from "mongoose";
import ApplicantRepository from "../repositories/ApplicantRepository";
import { IApplicant } from "../interfaces/ICandidate";
import ApplicantDTO from "../dtos/ApplicantDTO";
import { log } from "console";

export default class ApplicantService {
    private applicantRepository: ApplicantRepository;

    constructor(applicantRepository: ApplicantRepository) {
        this.applicantRepository = applicantRepository;
    }

    // async getCandidatesApplied(jobPostId: string): Promise<ApplicantDTO[] | null> {
    //     if (!Types.ObjectId.isValid(jobPostId)) {
    //         throw new Error("Invalid Applicant ID format.");
    //     }
    //     const data = await this.applicantRepository.findCandidatesApplied(jobPostId);
    //     if (!data) {
    //         return null;
    //     }
    //     // log("Candidates applied: ", data.map((applicant) => this.toApplicantDTO(applicant)));
    //     return data.map((applicant) => this.toApplicantDTO(applicant));
    // }

    async getCandidatesApplied(jobPostId: string) {
        try {
            const sortedApplicants = await this.applicantRepository.sortedApplicants(jobPostId);
            if (!sortedApplicants) {
                return [];
            }
            return sortedApplicants;
        } catch (error) {
            console.error('Error fetching sorted applicants:', error);
            throw error;
        }
    }

    async getPotentialCandidate(jobPostId: string, userId: string): Promise<IApplicant | null> {
        const data: IApplicant | null = await this.applicantRepository.findOne({ userId, jobPostId });
        if (!data) {
            return null;
        }
        return data;
    }
}