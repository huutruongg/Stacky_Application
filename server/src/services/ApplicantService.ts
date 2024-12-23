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

    public updateCandidatesStatus = async (jobPostId: string, userIds: string[], status: string) => {
        try {
            // Chuyển đổi userIds và jobPostId sang ObjectId
            const objectIds = userIds.map((id) => new Types.ObjectId(id));
            const jobPostObjectId = new Types.ObjectId(jobPostId);
    
            // Cập nhật trạng thái trong ApplicantModel
            const updatedApplicants = await ApplicantModel.updateMany(
                { jobPostId: jobPostObjectId, userId: { $in: objectIds } },
                { $set: { status } }
            );
    
            // Cập nhật trạng thái trong CandidateModel -> JobAppliedSchema
            const updatedCandidates = await CandidateModel.updateMany(
                { userId: { $in: objectIds }, "jobApplied.jobPostId": jobPostObjectId },
                { $set: { "jobApplied.$.status": status } } // Chỉ cập nhật jobApplied tương ứng với jobPostId
            );
    
            // Kiểm tra nếu không có bản ghi nào được cập nhật
            if (updatedApplicants.modifiedCount === 0 && updatedCandidates.modifiedCount === 0) {
                return false;
            }
    
            return true;
        } catch (error) {
            console.error("Error updating candidate status:", error);
            return false;
        }
    };
    
}