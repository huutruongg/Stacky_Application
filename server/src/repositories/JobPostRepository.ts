import { IJobPost } from './../interfaces/IJobPost';

import { log } from "console";
import { IJobPostMin } from "../interfaces/IJobPost";
import JobPostModel from "../models/JobPostModel";
import { BaseRepository } from "./BaseRepository";
import { Document, Types } from "mongoose";
import { PostStatus } from "../enums/EPostStatus";
import { ApplyStatus } from "../enums/EApplySatus";
import { IApplicant } from "../interfaces/ICandidate";

export default class JobPostRepository extends BaseRepository<IJobPost> {

    constructor() {
        super(JobPostModel);
    }

    async findAllByCondition(query: object): Promise<IJobPost[]> {
        return await this.model.find(query).exec();
    }

    async findById(id: string): Promise<IJobPost | null> {
        return await this.model.findById(new Types.ObjectId(id)).exec();
    }

    async findJobPostByUserId(userId: string): Promise<IJobPostMin | null> {
        const data = await this.model.findOne({ userId: new Types.ObjectId(userId) }).lean<IJobPostMin>().exec();
        return data;
    }

    async findAllMinData(): Promise<IJobPostMin[] | null> {
        return await this.model
            .find()
            .select("_id jobTitle jobImage jobSalary location userId")
            .lean<IJobPostMin[]>()
            .exec();
    }


    async createJobPost(orgName: string, data: IJobPost): Promise<IJobPost> {
        log('data', data);
        const newJobPost = await this.model.create({
            userId: data.userId,
            jobTitle: data.jobTitle,
            jobImage: data.jobImage,
            orgName: orgName,
            typeOfWork: data.typeOfWork,
            location: data.location,
            jobSalary: data.jobSalary,
            candidatesLimit: Number(data.candidatesLimit),
            educationRequired: data.educationRequired,
            yearsOfExperience: data.yearsOfExperience,
            typeOfIndustry: data.typeOfIndustry,
            professionalSkills: data.professionalSkills,
            certificateRequired: data.certificateRequired,
            languagesRequired: data.languagesRequired,
            jobBenefit: data.jobBenefit,
            leavePolicy: data.leavePolicy,
            jobDescription: data.jobDescription,
            workEnvironment: data.workEnvironment,
            applicationDeadline: new Date(data.applicationDeadline),
            jobSchedule: new Date(data.jobSchedule),
            staffLevel: data.staffLevel,
            genderRequired: data.genderRequired,
            postedAt: new Date(),
            invisible: false
        });
        return newJobPost;
    }

    async updateJobPost(id: string, data: Partial<IJobPost>): Promise<IJobPost | null> {
        return await this.model
            .findByIdAndUpdate(new Types.ObjectId(id), data, { new: true })
            .exec();
    }

    async deleteJobPost(id: string): Promise<boolean | null> {
        const data = await this.model.findByIdAndDelete(new Types.ObjectId(id)).exec();
        return !!data;
    }

    async findJobPostsByUserId(userId: string): Promise<IJobPost[]> {
        return await this.model.find({ userId: new Types.ObjectId(userId) }).exec();
    }

    async getAllJobPosts(): Promise<IJobPost[]> {
        return await this.model.find({ invisible: false }).exec();
    }

    async getJobPostsByPage(page: number, pageSize: number): Promise<IJobPost[]> {
        return await this.model.find({ invisible: false }).skip(page * pageSize).limit(pageSize).exec();
    }

    async getJobPostByIds(ids: string[]): Promise<any[]> {
        try {
            // log('ids', ids.map(id => new Types.ObjectId(id)) );
            const data = await this.model
                .find({ _id: { $in: ids.map(id => new Types.ObjectId(id)) } }).select(
                    "jobTitle orgName jobImage jobSalary location typeOfWork applicationDeadline postStatus postedAt userId"
                ).lean().exec();
            // log('data', data);
            if (!data) {
                return [];
            }
            return data;
        } catch (error) {
            console.error('Error fetching job posts:', error);
            throw new Error('Failed to retrieve job posts');
        }
    }

    async addApplicantToJobPost(jobPostId: string, newApplicant: IApplicant): Promise<boolean> {
        const result = await this.model.updateOne(
            { _id: jobPostId },
            { $push: { applicants: newApplicant } }
        );
        return result.modifiedCount > 0;
    }

    async exists(jobPostId: string): Promise<boolean> {
        const result = await this.model.exists({ _id: jobPostId });
        return result !== null;
    }

    async isJobOwner(userId: string, jobPostId: string): Promise<boolean> {
        const jobPost = await this.model.findOne({ _id: jobPostId, userId: userId }).lean();
        return !!jobPost;
    }

    async getJobPostsByRecruiter(userId: string) {
        log("recruiterId", userId);
        const data = await this.model.find({ userId: new Types.ObjectId(userId) }).lean().exec();
        log("data", data);
        return data;
    }

    async getJobPostedByRecruiter(userId: string): Promise<IJobPost[]> {
        return await this.model.find({ userId: new Types.ObjectId(userId), invisible: false }).select("_id userId jobTitle orgName typeOfIndustry candidatesLimit postedAt applicationDeadline").lean().exec();
    }
}