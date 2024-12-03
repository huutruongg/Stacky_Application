import { Types } from "mongoose";
import CandidateModel from "../models/CandidateModel";
import JobPostModel from "../models/JobPostModel";
import RecruiterModel from "../models/RecruiterModel";
import { RevenueReport } from "../models/RevenueModel";
import UserModel from "../models/UserModel";
import CandidateRepository from "../repositories/CandidateRepository";
import JobPostRepository from "../repositories/JobPostRepository";
import RecruiterRepository from "../repositories/RecruiterRepository";
import { ICandidate } from "../interfaces/ICandidate";
import ApplicantModel from "../models/ApplicantModel";
import { log } from "console";

export default class AdminService {
    private candidateRepository: CandidateRepository;
    private recruiterRepository: RecruiterRepository;
    private jobPostRepository: JobPostRepository;
    constructor(candidateRepository: CandidateRepository, recruiterRepository: RecruiterRepository, jobPostRepository: JobPostRepository) {
        this.candidateRepository = candidateRepository;
        this.recruiterRepository = recruiterRepository;
        this.jobPostRepository = jobPostRepository;

    }

    public async getAllCandidates() {
        const result = await CandidateModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    let: { userId: '$userId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                        { $project: { createdAt: 1, _id: 0 } }
                    ],
                    as: 'user'
                }
            },
            {
                $project: {
                    userId: 1,
                    fullName: 1,
                    publicEmail: 1,
                    avatarUrl: 1,
                    createdAt: { $arrayElemAt: ['$user.createdAt', 0] }
                }
            }
        ]);
        return result;
    }

    public async getAllRecruiters() {
        const result = await RecruiterModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    userId: 1,
                    orgEmail: 1,
                    orgName: 1,
                    createdAt: { $arrayElemAt: ['$user.createdAt', 0] }
                }
            }
        ]);
        return result;
    }

    public async getAllJobs() {
        const result = await JobPostModel.aggregate([
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

    public async getDetailCompany(userId: string) {
        const result = await RecruiterModel.aggregate([
            {
                $match: {
                    userId: new Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'jobposts',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'jobPosts'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    _id: 1,
                    orgName: 1,
                    orgTaxNumber: 1,
                    orgAddress: 1,
                    orgWebsiteUrl: 1,
                    orgEmail: 1,
                    phoneNumber: { $arrayElemAt: ['$user.phoneNumber', 0] },
                    jobPostCount: { $size: '$jobPosts' }
                }
            }
        ]);

        return result.length > 0 ? result[0] : null;
    }

    public async getDetailCandidate(candidateId: string) {
        const data = await CandidateModel.findOne({ userId: new Types.ObjectId(candidateId) })
            .select("userId fullName publicEmail avatarUrl createdAt oauthToken")
            .lean()
            .exec() as ICandidate | null;
        if (!data || !data.oauthToken) return null;

        const userData = await UserModel.findById({ _id: new Types.ObjectId(candidateId) }).select("privateEmail createdAt").lean().exec();
        if (!userData) return null; 

        const result = {
            userId: data.userId,
            fullName: data.fullName,
            publicEmail: data.publicEmail,
            avatarUrl: data.avatarUrl,
            createdAt: userData.createdAt,
            loginWith: `${data.oauthToken.provider} - ${userData.privateEmail}`
        };
        return result;
    }

    public async countJobsByMonth(year: string) {
        const selectedYear = parseInt(year, 10);
        log("selectedYear", selectedYear);
        const monthNames = [
            "january", "february", "march", "april", "may",
            "june", "july", "august", "september", "october",
            "november", "december"
        ];
    
        // Initialize months array with default values for the selected year
        const months = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1, // 1 for January, 2 for February, etc.
            postCount: 0,
        }));
    
        const result = await JobPostModel.aggregate([
            {
                $addFields: {
                    postedAt: { $toDate: "$postedAt" }, // Ensure postedAt is a Date
                },
            },
            {
                $match: {
                    $expr: {
                        $eq: [{ $year: "$postedAt" }, selectedYear], // Match only the selected year
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$postedAt" }, // Group by month
                    postCount: { $sum: 1 }, // Count posts in each month
                },
            },
            {
                $project: {
                    month: "$_id",
                    postCount: 1,
                    _id: 0,
                },
            },
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
    

    private async getTotalDepositRevenue() {
        const totalDeposit = await RevenueReport.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$depositRevenue' }
                }
            }
        ]);
        if (totalDeposit.length === 0) {
            return 0;
        }
        return totalDeposit[0].total || 0;
    }

    private async getJobs() {
        return await JobPostModel.countDocuments();
    }

    private async getCompanies() {
        return await RecruiterModel.countDocuments().lean().exec();
    }

    private async getCandidates() {
        return await CandidateModel.countDocuments().lean().exec();
    }

    public async getTotalCards() {
        const totalRevenue = await this.getTotalDepositRevenue();
        const totalCards = {
            totalRevenue: totalRevenue,
            totalJobs: await this.getJobs(),
            totalCompanies: await this.getCompanies(),
            totalCandidates: await this.getCandidates()
        }
        return totalCards;
    }

    public async getTop5PostedJobs() {
        const topRecruiters = await JobPostModel.aggregate([
            {
                $group: {
                    _id: "$userId",  // Group by recruiter (userId)
                    numberOfPost: { $sum: 1 },  // Count the number of posts for each recruiter
                    typeOfIndustry: { $first: "$typeOfIndustry" }  // Get the type of industry for each recruiter
                }
            },
            {
                $lookup: {
                    from: 'recruiters',  // Name of the Recruiter collection
                    localField: '_id',    // The userId from JobPost
                    foreignField: 'userId',  // The userId in the Recruiter collection
                    as: 'recruiterDetails'
                }
            },
            {
                $unwind: "$recruiterDetails"  // Flatten the recruiterDetails array
            },
            {
                $project: {
                    orgImage: "$recruiterDetails.orgImage",
                    orgName: "$recruiterDetails.orgName",
                    typeOfIndustry: 1,
                    numberOfPost: 1  // Include the number of posts
                }
            },
            {
                $sort: { numberOfPost: -1 }  // Sort by number of posts in descending order
            },
            {
                $limit: 5  // Limit to top 5 recruiters
            }
        ]);
        log("topRecruiters", topRecruiters);
        return topRecruiters;
    }

    public async getRevenueReport(year: string) {
        // find all revenue report by year
        const revenue = await RevenueReport.find({ year: year }).sort({ month: 1 }); // sort by month ascending
        // Month names
        const monthNames = [
            "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"
        ];

        // Map revenue data to month names
        const monthlyRevenue = monthNames.reduce((result: any, monthName: string, index: any) => {
            const month = index + 1; // Tháng từ 1 đến 12
            const monthData = revenue.find(item => String(item.month) === month.toString());
            // If monthData is not found, set depositRevenue and paymentRevenue to 0
            result[monthName] = {
                depositRevenue: monthData ? monthData.depositRevenue : 0,
                paymentRevenue: monthData ? monthData.paymentRevenue : 0,
            };
            return result;
        }, {});

        return monthlyRevenue;
    }

    public async deleteJob(jobId: string) {
        await JobPostModel.deleteOne({ _id: jobId }).exec();
    }

    public async deleteCandidate(candidateId: string) {
        await CandidateModel.deleteOne({ userId: new Types.ObjectId(candidateId) }).exec();
        await UserModel.deleteOne({ _id: new Types.ObjectId(candidateId) }).exec();
        await ApplicantModel.deleteMany({ userId: new Types.ObjectId(candidateId) }).exec();
    }

    public async deleteCompany(recruiterId: string) {
        await RecruiterModel.deleteOne({ userId: new Types.ObjectId(recruiterId) }).exec();
        await UserModel.deleteOne({ _id: new Types.ObjectId(recruiterId) }).exec();
        await JobPostModel.deleteMany({ userId: new Types.ObjectId(recruiterId) }).exec();
    }

    public async searchJobs(query: string) {
        const result = await JobPostModel.aggregate([
            {
                $match: {
                    $or: [
                        { jobTitle: { $regex: query, $options: 'i' } },
                        { orgName: { $regex: query, $options: 'i' } },
                        { typeOfIndustry: { $regex: query, $options: 'i' } }
                    ]
                }
            },
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
            }
        ]);
        return result;
    }

    public async searchCandidates(query: string) {
        const result = await CandidateModel.aggregate([
            {
                $match: {
                    $or: [
                        { fullName: { $regex: query, $options: 'i' } },
                        { publicEmail: { $regex: query, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    userId: 1,
                    fullName: 1,
                    publicEmail: 1,
                    avatarUrl: 1,
                    createdAt: { $arrayElemAt: ['$user.createdAt', 0] }
                }
            }
        ]);
        return result
    }

    public async searchCompanies(query: string) {
        const result = await RecruiterModel.aggregate([
            {
                $match: {
                    $or: [
                        { orgName: { $regex: query, $options: 'i' } },
                        { orgEmail: { $regex: query, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    userId: 1,
                    orgEmail: 1,
                    orgName: 1,
                    createdAt: { $arrayElemAt: ['$user.createdAt', 0] }
                }
            }
        ]);
        return result;
    }
}