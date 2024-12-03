import { log } from "console";
import { ICandidate, IProfile } from "../interfaces/ICandidate";
import CandidateModel from "../models/CandidateModel";
import { BaseRepository } from "./BaseRepository";
import { FlattenMaps, Types } from "mongoose";
import { ApplyStatus } from "../enums/EApplySatus";
import { IJobSaved } from "../interfaces/IJobPost";
import { IOAuthToken } from "../interfaces/IOauthToken";

export default class CandidateRepository extends BaseRepository<ICandidate> {
    constructor() {
        super(CandidateModel);
    }

    async findById(id: string): Promise<ICandidate | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await this.model.findById(new Types.ObjectId(id)).exec();
    }

    async findCandidateByUserId(userId: string): Promise<ICandidate | null> {
        if (!Types.ObjectId.isValid(userId)) return null;
        return await this.model.findOne({ userId: new Types.ObjectId(userId) }).exec();
    }

    async findAppliedJobs(userId: string): Promise<any[] | null> {
        try {
            // Tìm tài liệu với userId cụ thể và chỉ lấy trường "jobApplied"
            const result = await this.model
                .findOne({ userId: new Types.ObjectId(userId) })
                .select("jobApplied")
                .lean();

            if (!result || !result.jobApplied) {
                console.warn(`No applied jobs found for user: ${userId}`);
                return [];
            }

            return result.jobApplied;
        } catch (error) {
            console.error('Error fetching applied jobs:', error);
            return null;
        }
    }


    async createCandidate(data: Partial<ICandidate>): Promise<ICandidate> {
        const newCandidate = new this.model(data);
        return await newCandidate.save();
    }

    async updateOauth(
        userId: string,
        provider: string,
        accessToken: string
    ): Promise<ICandidate | null> {
        log("userId", userId);
    
        return await this.model.findOneAndUpdate(
            { userId: new Types.ObjectId(userId) },
            { $set: { oauthToken: { provider, accessToken } } },
            { new: true } // Trả về document đã cập nhật
        ).exec();
    }
    

    async updateCandidate(userId: string, data: Partial<ICandidate>): Promise<ICandidate | null> {
        const result = await this.model.findOneAndUpdate(
            { userId: new Types.ObjectId(userId) },
            data,
            { new: true }
        ).exec();
        return result;
    }

    async deleteCandidate(userId: string): Promise<boolean> {
        const result = await this.model.findOneAndDelete({ userId: new Types.ObjectId(userId) }).exec();
        return result !== null;
    }

    async bulkUpdate(bulkOps: any[]): Promise<void> {
        await this.model.bulkWrite(bulkOps);
    }

    async checkExistingUserInJobSaved(userId: string, jobPostId: string): Promise<boolean> {
        try {
            const isExisting = await this.model.findOne({
                userId: new Types.ObjectId(userId),
                'jobSaved.jobPostId': new Types.ObjectId(jobPostId),
            }).exec();
            return isExisting !== null;
        } catch (error) {
            console.error('Error checking job saved:', error);
            return false;
        }
    }

    async getJobIdsSaved(userId: Types.ObjectId): Promise<string[] | null> {
        try {
            // Query the Candidate model with a proper projection
            const candidate = await this.model.findOne(
                { userId: userId },
                { 'jobSaved.jobPostId': 1, _id: 0 } // Projection
            ).lean<{ jobSaved: IJobSaved[] } | null>();

            // Check if jobSaved exists and map jobPostIds to strings
            if (candidate?.jobSaved) {
                const jobPostIds: string[] = candidate.jobSaved.map((job: IJobSaved) =>
                    (job.jobPostId as Types.ObjectId).toString()
                );
                return jobPostIds;
            }
            return null;
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            return null;
        }
    }
    async hasApplied(userId: string, jobPostId: string): Promise<boolean> {
        const candidate = await this.model.findOne({
            userId,
            "jobApplied.jobPostId": jobPostId,
        }).lean();
        return !!candidate;
    }

    async findByUserId(userId: string): Promise<ICandidate | null> {
        return await this.model.findOne({ userId }).lean<ICandidate>().exec();
    }

    async addJobApplied(userId: string, jobPostId: string): Promise<void> {
        await this.model.updateOne(
            { userId },
            {
                $push: {
                    jobApplied: {
                        jobPostId,
                        status: ApplyStatus.PENDING,
                        appliedAt: new Date(),
                    },
                },
            }
        );
    }

    async saveJobPost(userId: string, jobSavedId: string): Promise<boolean> {
        const result = await this.model.updateOne(
            {
                userId,
                "jobSaved.jobPostId": { $ne: jobSavedId }
            },
            { $push: { jobSaved: { jobPostId: jobSavedId } } }
        );
        return result.modifiedCount > 0;
    }

    async removeSavedJob(userId: string, jobPostId: string): Promise<boolean> {
        const result = await this.model.updateOne(
            {
                userId: userId,
                "jobSaved.jobPostId": jobPostId,
            },
            { $pull: { jobSaved: { jobPostId: jobPostId } } }
        );
        return result.modifiedCount > 0;
    }

    async updateApplyStatus(userId: string, jobPostId: string, status: string): Promise<boolean> {
        const result = await this.model.updateOne(
            {
                userId,
                "jobApplied.jobPostId": jobPostId,
            },
            { $set: { "jobApplied.$.status": status } }
        );
        return result.modifiedCount > 0;
    }

    async updateAccountProfile(userId: string, data: Partial<IProfile>): Promise<boolean> {
        const result = await this.model.updateOne(
            { userId: new Types.ObjectId(userId) },
            data
        );
        return result.modifiedCount > 0;
    }

    async getGithubToken(userId: string): Promise<string | null> {
        const candidate = await this.model.findOne({ userId: new Types.ObjectId(userId) }).select("oauthToken").lean();
        if (!candidate) return null;
        return candidate.oauthToken?.accessToken as string;
    }
}
