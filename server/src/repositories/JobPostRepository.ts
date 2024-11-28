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


    async createJobPost(orgName: string, data: Partial<IJobPost>): Promise<IJobPost> {
        const newJobPost = await this.model.create({
            ...data,
            orgName: orgName,
            postStatus: PostStatus.PENDING,
            postedAt: new Date(),
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
        return await this.model.find({invisible: false}).exec();
    }

    async getJobPostsByPage(page: number, pageSize: number): Promise<IJobPost[]> {
        return await this.model.find({invisible: false}).skip(page * pageSize).limit(pageSize).exec();
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

    async findAll_a(): Promise<IJobPost[]> {
        const result = await this.model.aggregate([
            {
                $project: {
                    _id: 1,
                    jobTitle: 1,
                    orgName: 1,
                    typeOfIndustry: 1,
                    candidatesLimit: 1,
                    postedAt: 1,
                    applicationDeadline: 1
                }
            },
            {
                $sort: { postedAt: -1 }
            }
        ]);
        return result;
    }

    // async countJobsByMonth(): Promise<{ month: number, postCount: number }[]> {
    //     const result = await JobPostModel.aggregate([
    //         // Chuyển đổi `postedAt` thành kiểu Date nếu cần thiết
    //         {
    //             $addFields: {
    //                 postedAt: { $toDate: "$postedAt" } // Chuyển đổi nếu `postedAt` là chuỗi
    //             }
    //         },
    //         // Nhóm dữ liệu theo tháng
    //         {
    //             $group: {
    //                 _id: { $month: "$postedAt" }, // Lấy tháng từ `postedAt`
    //                 postCount: { $sum: 1 } // Đếm số lượng bài viết
    //             }
    //         },
    //         // Chuẩn hóa dữ liệu (thêm tháng không có bài viết với postCount = 0)
    //         {
    //             $project: {
    //                 month: '$_id',
    //                 postCount: 1,
    //                 _id: 0
    //             }
    //         },
    //         // Thêm các tháng mặc định từ 1 đến 12
    //         {
    //             $unionWith: {
    //                 // coll: null, // Thực hiện trên pipeline hiện tại
    //                 pipeline: [
    //                     {
    //                         $project: {
    //                             month: {
    //                                 $literal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] // Tất cả các tháng
    //                             },
    //                             postCount: { $literal: 0 } // Số lượng mặc định
    //                         }
    //                     },
    //                     { $unwind: "$month" } // Tách từng tháng thành các tài liệu riêng
    //                 ]
    //             }
    //         },
    //         // Tổng hợp dữ liệu, ưu tiên dữ liệu thực tế
    //         {
    //             $group: {
    //                 _id: "$month",
    //                 postCount: { $max: "$postCount" } // Giữ giá trị lớn nhất (ưu tiên dữ liệu thực tế)
    //             }
    //         },
    //         // Định dạng dữ liệu
    //         {
    //             $project: {
    //                 month: '$_id',
    //                 postCount: 1,
    //                 _id: 0
    //             }
    //         },
    //         // Sắp xếp theo thứ tự tháng
    //         {
    //             $sort: { month: 1 }
    //         }
    //     ]);


    //     return result;
    // };
    async stacticsJobsfor12Months(): Promise<any> {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11); // Go back 11 months
    
        const monthNames = [
            "january", "february", "march", "april", "may", 
            "june", "july", "august", "september", "october", 
            "november", "december"
        ];
    
        const months = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - 11 + i); // Generate months dynamically
            return { month: date.getMonth() + 1, postCount: 0 }; // Default value
        });
    
        const result = await this.model.aggregate([
            {
                $addFields: {
                    postedAt: { $toDate: "$postedAt" }
                }
            },
            {
                $match: {
                    postedAt: { $gte: twelveMonthsAgo } // Only include jobs from the last 12 months
                }
            },
            {
                $group: {
                    _id: { $month: "$postedAt" },
                    postCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    month: "$_id",
                    postCount: 1,
                    _id: 0
                }
            }
        ]);
    
        // Merge with default months
        const mergedResult = months.map((month) => {
            const found = result.find((r) => r.month === month.month);
            return found || month;
        });
    
        // Map result to named format
        const namedResult: Record<string, number> = {};
        mergedResult.forEach(({ month, postCount }) => {
            const monthName = monthNames[month - 1];
            namedResult[monthName] = postCount;
        });
    
        return namedResult;
    }
    
    async count_a(): Promise<number> {
        return await this.model.countDocuments();
    }
    
}