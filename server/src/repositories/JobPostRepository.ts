import { IJobPost } from './../interfaces/IJobPost';
import { log } from "console";
import { IJobPostMin } from "../interfaces/IJobPost";
import JobPostModel from "../models/JobPostModel";
import { BaseRepository } from "./BaseRepository";
import { Types } from "mongoose";
import { IApplicant } from "../interfaces/ICandidate";

export default class JobPostRepository extends BaseRepository<IJobPost> {

    constructor() {
        super(JobPostModel);
    }

    public findAllByCondition = async (query: object): Promise<IJobPost[]> => {
        return await this.model.find(query).exec();
    }

    public findById = async (id: string): Promise<IJobPost | null> => {
        return await this.model.findById(new Types.ObjectId(id)).exec();
    }

    public findJobPostByUserId = async (userId: string): Promise<IJobPostMin | null> => {
        return await this.model.findOne({ userId: new Types.ObjectId(userId) }).lean<IJobPostMin>().exec();
    }

    public findAllMinData = async (): Promise<IJobPostMin[] | null> => {
        return await this.model
            .find()
            .select("_id jobTitle jobImage jobSalary location userId")
            .lean<IJobPostMin[]>()
            .exec();
    }

    public createJobPost = async (orgName: string, data: IJobPost): Promise<IJobPost> => {
        log('data', data);
        const newJobPost = await this.model.create({
            ...data,
            orgName,
            candidatesLimit: Number(data.candidatesLimit),
            applicationDeadline: new Date(data.applicationDeadline),
            jobSchedule: new Date(data.jobSchedule),
            postedAt: new Date(),
            invisible: false
        });
        return newJobPost;
    }

    public updateJobPost = async (id: string, data: Partial<IJobPost>): Promise<IJobPost | null> => {
        return await this.model
            .findByIdAndUpdate(new Types.ObjectId(id), data, { new: true })
            .exec();
    }

    public deleteJobPost = async (id: string): Promise<boolean> => {
        const data = await this.model.findByIdAndDelete(new Types.ObjectId(id)).exec();
        return !!data;
    }

    public findJobPostsByUserId = async (userId: string): Promise<IJobPost[]> => {
        return await this.model.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    public getAllJobPosts = async (): Promise<IJobPost[]> => {
        return await this.model.find({ invisible: false }).exec();
    }

    public getJobPostsByPage = async (page: number, pageSize: number): Promise<IJobPost[]> => {
        return await this.model.find({ invisible: false }).skip(page * pageSize).limit(pageSize).exec();
    }

    public getJobPostByIds = async (ids: string[]): Promise<any[]> => {
        try {
            const data = await this.model
                .find({ _id: { $in: ids.map(id => new Types.ObjectId(id)) } })
                .select("jobTitle orgName jobImage jobSalary location typeOfWork applicationDeadline postStatus postedAt userId")
                .lean()
                .exec();
            return data || [];
        } catch (error) {
            console.error('Error fetching job posts:', error);
            throw new Error('Failed to retrieve job posts');
        }
    }

    public addApplicantToJobPost = async (jobPostId: string, newApplicant: IApplicant): Promise<boolean> => {
        const result = await this.model.updateOne(
            { _id: jobPostId },
            { $push: { applicants: newApplicant } }
        );
        return result.modifiedCount > 0;
    }

    public exists = async (jobPostId: string): Promise<boolean> => {
        const result = await this.model.exists({ _id: jobPostId });
        return result !== null;
    }

    public isJobOwner = async (userId: string, jobPostId: string): Promise<boolean> => {
        const jobPost = await this.model.findOne({ _id: jobPostId, userId }).lean();
        return !!jobPost;
    }

    public getJobPostsByRecruiter = async (userId: string) => {
        log("recruiterId", userId);
        const data = await this.model.find({ userId: new Types.ObjectId(userId) }).lean().exec();
        log("data", data);
        return data;
    }

    public getJobPostedByRecruiter = async (userId: string): Promise<IJobPost[]> => {
        return await this.model.find({ userId: new Types.ObjectId(userId), invisible: false })
            .select("_id userId jobTitle orgName typeOfIndustry candidatesLimit postedAt applicationDeadline")
            .lean()
            .exec();
    }

    public getTopRecruiters = async (): Promise<any[]> => {
        const topRecruiters = await this.model.aggregate([
            {
                $group: {
                    _id: "$userId",
                    numberOfPost: { $sum: 1 },
                    typeOfIndustry: { $first: "$typeOfIndustry" }
                }
            },
            {
                $lookup: {
                    from: 'recruiters',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'recruiterDetails'
                }
            },
            { $unwind: "$recruiterDetails" },
            {
                $project: {
                    orgImage: "$recruiterDetails.orgImage",
                    orgName: "$recruiterDetails.orgName",
                    typeOfIndustry: 1,
                    numberOfPost: 1
                }
            },
            { $sort: { numberOfPost: -1 } },
            { $limit: 10 }
        ]);
        log("topRecruiters", topRecruiters);
        return topRecruiters;
    }

    public getTopJobSalaries = async (): Promise<any[]> => {
        const topJobSalaries = await this.model.aggregate([
            { $match: { invisible: false } },
            { $sort: { jobSalary: -1 } },
            { $limit: 10 },
            {
                $project: {
                    jobTitle: 1,
                    jobImage: 1,
                    typeOfIndustry: 1,
                    jobSalary: 1
                }
            }
        ]);
        log("topJobSalaries", topJobSalaries);
        return topJobSalaries;
    }
}
