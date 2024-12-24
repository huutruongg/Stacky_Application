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

    public findById = async (id: string): Promise<IApplicant | null> => this.model.findById(id);

    public findApplicantByUserId = async (userId: string): Promise<IApplicant | null> => this.model.findOne({ userId }).exec();

    public createApplicant = async (data: Partial<IApplicant>): Promise<IApplicant> => this.model.create(data);

    public deleteApplication = async (userId: string, jobPostId: string): Promise<IApplicant | null> => 
        this.model.findOneAndDelete({ userId: new Types.ObjectId(userId), jobPostId: new Types.ObjectId(jobPostId) }).exec();

    public findCandidatesApplied = async (jobPostId: string): Promise<IApplicant[] | null> => this.model.find({ jobPostId }).exec();

    public isExistingApplicant = async (userId: string, jobPostId: string): Promise<boolean> => 
        (await this.model.findOne({ userId, jobPostId }).exec()) !== null;

    public updateAIResult = async (userId: string, jobPostId: string, aiResult: IAIResult): Promise<boolean | null> => 
        (await this.model.findOneAndUpdate({ userId, jobPostId }, { aiAnalysistScore: aiResult }).exec()) !== null;

    public sortedApplicants = async (jobPostId: string) => {
        try {
            const applicants = await this.model.aggregate([
                { $match: { jobPostId: new Types.ObjectId(jobPostId) } },
                { $addFields: { totalScore: { $add: ["$aiAnalysistScore.professionalSkills", "$aiAnalysistScore.educations", "$aiAnalysistScore.languages", "$aiAnalysistScore.certifications"] } } },
                { $sort: { totalScore: -1, githubScore: -1 } },
                { $project: { jobPostId: 1, userId: 1, fullName: 1, publicEmail: 1, avatarUrl: 1, personalDescription: 1, githubScore: 1, totalScore: 1, appliedAt: 1, isSent: 1, status: 1 } }
            ]);

            return applicants as ApplicantDTO[];
        } catch (error) {
            console.error('Error fetching sorted applicants:', error);
            throw error;
        }
    }

    public updateGithubScore = async (userId: string, jobPostId: string, score: number): Promise<boolean> => {
        const result = await this.model.updateOne(
            { userId: new Types.ObjectId(userId), jobPostId: new Types.ObjectId(jobPostId) },
            { githubScore: score }
        );
        log("result", result);
        return result.modifiedCount > 0;
    }
}
