import { log } from "console";
import { ICandidate, IProfile } from "../interfaces/ICandidate";
import CandidateModel from "../models/CandidateModel";
import { BaseRepository } from "./BaseRepository";
import { FlattenMaps, Types } from "mongoose";
import { ApplyStatus } from "../enums/EApplySatus";
import { IJobSaved } from "../interfaces/IJobPost";
import { IOAuthToken } from "../interfaces/IOauthToken";
import ApplicantModel from "../models/ApplicantModel";

export default class CandidateRepository extends BaseRepository<ICandidate> {
    constructor() {
        super(CandidateModel);
    }

    public findById = async (id: string): Promise<ICandidate | null> => {
        if (!Types.ObjectId.isValid(id)) return null;
        return await this.model.findById(new Types.ObjectId(id)).exec();
    };

    public findCandidateByUserId = async (userId: string): Promise<ICandidate | null> => {
        if (!Types.ObjectId.isValid(userId)) return null;
        return await this.model.findOne({ userId: new Types.ObjectId(userId) })
            .select("userId fullName languages projects educations experiences certifications address avatarUrl birthDate gender githubUrl jobPosition linkedinUrl personalDescription phoneNumber publicEmail professionalSkills").exec();
    };

    public findAppliedJobs = async (userId: string): Promise<any[] | null> => {
        try {
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
    };

    public createCandidate = async (data: Partial<ICandidate>): Promise<ICandidate> => {
        const newCandidate = new this.model(data);
        return await newCandidate.save();
    };

    public updateOauth = async (
        userId: string,
        provider: string,
        accessToken: string
    ): Promise<ICandidate | null> => {
        log("userId", userId);

        return await this.model.findOneAndUpdate(
            { userId: new Types.ObjectId(userId) },
            { $set: { oauthToken: { provider, accessToken } } },
            { new: true }
        ).exec();
    };

    public updateCandidate = async (userId: string, data: Partial<ICandidate>): Promise<ICandidate | null> => {
        return await this.model.findOneAndUpdate(
            { userId: new Types.ObjectId(userId) },
            data,
            { new: true }
        ).exec();
    };

    public deleteCandidate = async (userId: string): Promise<boolean> => {
        const result = await this.model.findOneAndDelete({ userId: new Types.ObjectId(userId) }).exec();
        return result !== null;
    };

    public bulkUpdate = async (bulkOps: any[]): Promise<void> => {
        await this.model.bulkWrite(bulkOps);
    };

    public checkExistingUserInJobSaved = async (userId: string, jobPostId: string): Promise<boolean> => {
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
    };

    public getJobIdsSaved = async (userId: Types.ObjectId): Promise<string[] | null> => {
        try {
            const candidate = await this.model.findOne(
                { userId: userId },
                { 'jobSaved.jobPostId': 1, _id: 0 }
            ).lean<{ jobSaved: IJobSaved[] } | null>();

            if (candidate?.jobSaved) {
                return candidate.jobSaved.map((job: IJobSaved) =>
                    (job.jobPostId as Types.ObjectId).toString()
                );
            }
            return null;
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            return null;
        }
    };

    public hasApplied = async (userId: string, jobPostId: string): Promise<boolean> => {
        const candidate = await this.model.findOne({
            userId,
            "jobApplied.jobPostId": jobPostId,
        }).lean();
        return !!candidate;
    };

    public findByUserId = async (userId: string): Promise<ICandidate | null> => {
        return await this.model.findOne({ userId }).lean<ICandidate>().exec();
    };

    public addJobApplied = async (userId: string, jobPostId: string): Promise<void> => {
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
    };

    public saveJobPost = async (userId: string, jobSavedId: string): Promise<boolean> => {
        const result = await this.model.updateOne(
            {
                userId,
                "jobSaved.jobPostId": { $ne: jobSavedId }
            },
            { $push: { jobSaved: { jobPostId: jobSavedId } } }
        );
        return result.modifiedCount > 0;
    };

    public removeSavedJob = async (userId: string, jobPostId: string): Promise<boolean> => {
        const result = await this.model.updateOne(
            {
                userId: userId,
                "jobSaved.jobPostId": jobPostId,
            },
            { $pull: { jobSaved: { jobPostId: jobPostId } } }
        );
        return result.modifiedCount > 0;
    };

    public updateApplyStatus = async (userId: string, jobPostId: string, status: string): Promise<boolean> => {
        const result = await this.model.updateOne(
            {
                userId,
                "jobApplied.jobPostId": jobPostId,
            },
            { $set: { "jobApplied.$.status": status } }
        );
        return result.modifiedCount > 0;
    };

    public updateAccountProfile = async (userId: string, data: Partial<IProfile>): Promise<boolean> => {
        const result = await this.model.updateOne(
            { userId: new Types.ObjectId(userId) },
            data
        );
        return result.modifiedCount > 0;
    };

    public getGithubToken = async (userId: string): Promise<string | null> => {
        const candidate = await this.model.findOne({ userId: new Types.ObjectId(userId) }).select("oauthToken").lean();
        if (!candidate) return null;
        return candidate.oauthToken?.accessToken as string;
    };
}
