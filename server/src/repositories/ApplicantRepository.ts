import { Types } from "mongoose";
import { IAIResult, IApplicant } from "../interfaces/ICandidate";
import ApplicantModel from "../models/ApplicantModel";
import { BaseRepository } from "./BaseRepository";
import ApplicantDTO from "../dtos/ApplicantDTO";
import { log } from "console";

export default class ApplicantRepository extends BaseRepository<IApplicant> {
    constructor() {
        super(ApplicantModel);
    }

    async findById(id: string): Promise<IApplicant | null> {
        return await this.model.findById(id);
    }

    async findApplicantByUserId(userId: string): Promise<IApplicant | null> {
        return await this.model.findOne({ userId: userId }).exec();
    }

    async createApplicant(data: Partial<IApplicant>): Promise<IApplicant> {
        return await this.model.create(data);
    }

    async deleteApplication(userId: string, jobPostId: string): Promise<IApplicant | null> {
        return await this.model.findOneAndDelete({ userId: new Types.ObjectId(userId), jobPostId: new Types.ObjectId(jobPostId) }).exec();
    }

    async findCandidatesApplied(jobPostId: string): Promise<IApplicant[] | null> {
        return await this.model.find({ jobPostId: jobPostId }).exec();
    }

    async isExistingApplicant(userId: string, jobPostId: string): Promise<boolean> {
        const applicant = await this.model.findOne({ userId, jobPostId }).exec();
        return applicant !== null;
    }

    async updateAIResult(userId: string, jobPostId: string, aiResult: IAIResult): Promise<boolean | null> {
        const isUpdated = await this.model.findOneAndUpdate({ userId, jobPostId }, { aiAnalysistScore: aiResult }).exec();
        return isUpdated !== null;
    }

    async sortedApplicants(jobPostId: string) {
        try {
            const applicants = await this.model.aggregate([
                {
                    $match: { jobPostId: new Types.ObjectId(jobPostId) }, // Filter by jobPostId
                },
                {
                    $addFields: {
                        totalScore: {
                            $add: [
                                "$aiAnalysistScore.professionalSkills",
                                "$aiAnalysistScore.educations",
                                "$aiAnalysistScore.languages",
                                "$aiAnalysistScore.certifications"
                            ]
                        }
                    }
                },
                {
                    $sort: {
                        totalScore: -1, 
                        githubScore: -1 
                    }
                },
                {
                    $project: {
                        jobPostId: 1,
                        userId: 1,
                        fullName: 1,
                        publicEmail: 1,
                        avatarUrl: 1,
                        personalDescription: 1,
                        githubScore: 1,
                        totalScore: 1,
                        appliedAt: 1,
                        isSent: 1
                    }
                }
            ]);

            return applicants as ApplicantDTO[];
        } catch (error) {
            console.error('Error fetching sorted applicants:', error);
            throw error;
        }
    }

    async updateGithubScore(userId: string, jobPostId: string, score: number): Promise<boolean> {
        const result = await this.model.updateOne(
            { userId: new Types.ObjectId(userId), jobPostId: new Types.ObjectId(jobPostId) },
            { githubScore: score }
        )
        log("result", result);
        return result.modifiedCount > 0;
    }
}