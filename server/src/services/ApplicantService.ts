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

    private toApplicantDTO(applicant: IApplicant): ApplicantDTO {
        const { _id, fullName, publicEmail, avatarUrl, personalDescription, appliedAt } = applicant;
        return new ApplicantDTO(
            fullName,
            publicEmail,
            avatarUrl,
            personalDescription,
            new Date(appliedAt)
        );
    }

    async getCandidatesApplied(jobPostId: string): Promise<ApplicantDTO[] | null> {
        if (!Types.ObjectId.isValid(jobPostId)) {
            throw new Error("Invalid Applicant ID format.");
        }
        const data = await this.applicantRepository.findCandidatesApplied(jobPostId);
        if (!data) {
            return null;
        }
        // log("Candidates applied: ", data.map((applicant) => this.toApplicantDTO(applicant)));
        return data.map((applicant) => this.toApplicantDTO(applicant));
    }
}