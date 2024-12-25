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

    public getAllCandidates = async (includeDetails = false) => {
        return await CandidateModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    let: { userId: '$userId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                        { $project: { createdAt: 1, privateEmail: 1, _id: 0 } }
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
                    createdAt: { $arrayElemAt: ['$user.createdAt', 0] },
                    loginWith: {
                        $concat: [
                            { $ifNull: ['$oauthToken.provider', 'Unknown Provider'] },
                            ' - ',
                            { $ifNull: [{ $arrayElemAt: ['$user.privateEmail', 0] }, 'No Email'] }
                        ]
                    }
                }
            }
        ]);
    }

    public getDetailCandidate = async (candidateId: string) => {
        const data = await CandidateModel.findOne({ userId: new Types.ObjectId(candidateId) })
            .select("userId fullName publicEmail avatarUrl createdAt oauthToken")
            .lean()
            .exec() as ICandidate | null;
        if (!data || !data.oauthToken) return null;

        const userData = await UserModel.findById({ _id: new Types.ObjectId(candidateId) }).select("privateEmail createdAt").lean().exec();
        if (!userData) return null;

        return {
            userId: data.userId,
            fullName: data.fullName,
            publicEmail: data.publicEmail,
            avatarUrl: data.avatarUrl,
            createdAt: userData.createdAt,
            loginWith: `${data.oauthToken.provider} - ${userData.privateEmail}`
        };
    }

    public getAllRecruiters = async () => {
        return await RecruiterModel.aggregate([
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
    }

    public getAllJobs = async () => {
        return await JobPostModel.aggregate([
            {
                $project: {
                    _id: 1,
                    jobTitle: 1,
                    orgName: 1,
                    typeOfIndustry: 1,
                    candidatesLimit: 1,
                    postedAt: 1,
                    applicationDeadline: 1,
                    invisible: 1
                }
            },
            {
                $sort: { postedAt: -1 }
            }
        ]);
    }

    public getDetailCompany = async (userId: string) => {
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
                    orgImage: 1,
                    orgEmail: 1,
                    phoneNumber: { $arrayElemAt: ['$user.phoneNumber', 0] },
                    jobPostCount: { $size: '$jobPosts' }
                }
            }
        ]);

        return result.length > 0 ? result[0] : null;
    }

    public countJobsByMonth = async (year: string) => {
        const selectedYear = parseInt(year, 10);
        log("selectedYear", selectedYear);
        const monthNames = [
            "january", "february", "march", "april", "may",
            "june", "july", "august", "september", "october",
            "november", "december"
        ];

        const months = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            postCount: 0,
        }));

        const result = await JobPostModel.aggregate([
            {
                $addFields: {
                    postedAt: { $toDate: "$postedAt" },
                },
            },
            {
                $match: {
                    $expr: {
                        $eq: [{ $year: "$postedAt" }, selectedYear],
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$postedAt" },
                    postCount: { $sum: 1 },
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

        const mergedResult = months.map((month) => {
            const found = result.find((r) => r.month === month.month);
            return found || month;
        });

        const namedResult: Record<string, number> = {};
        mergedResult.forEach(({ month, postCount }) => {
            const monthName = monthNames[month - 1];
            namedResult[monthName] = postCount;
        });

        return namedResult;
    }

    private getTotalDepositRevenue = async () => {
        const totalDeposit = await RevenueReport.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$depositRevenue' }
                }
            }
        ]);
        return totalDeposit.length === 0 ? 0 : totalDeposit[0].total || 0;
    }

    private getJobs = async () => {
        return await JobPostModel.countDocuments();
    }

    private getCompanies = async () => {
        return await RecruiterModel.countDocuments().lean().exec();
    }

    private getCandidates = async () => {
        return await CandidateModel.countDocuments().lean().exec();
    }

    public getTotalCards = async () => {
        const totalRevenue = await this.getTotalDepositRevenue();
        return {
            totalRevenue: totalRevenue,
            totalJobs: await this.getJobs(),
            totalCompanies: await this.getCompanies(),
            totalCandidates: await this.getCandidates()
        };
    }

    public getTop5PostedJobs = async () => {
        const topRecruiters = await JobPostModel.aggregate([
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
            {
                $unwind: "$recruiterDetails"
            },
            {
                $project: {
                    orgImage: "$recruiterDetails.orgImage",
                    orgName: "$recruiterDetails.orgName",
                    typeOfIndustry: 1,
                    numberOfPost: 1
                }
            },
            {
                $sort: { numberOfPost: -1 }
            },
            {
                $limit: 5
            }
        ]);
        log("topRecruiters", topRecruiters);
        return topRecruiters;
    }

    public getRevenueReport = async (year: string) => {
        const revenue = await RevenueReport.find({ year: year }).sort({ month: 1 });
        const monthNames = [
            "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"
        ];

        return monthNames.reduce((result: any, monthName: string, index: any) => {
            const month = index + 1;
            const monthData = revenue.find(item => String(item.month) === month.toString());
            result[monthName] = {
                depositRevenue: monthData ? monthData.depositRevenue : 0,
                paymentRevenue: monthData ? monthData.paymentRevenue : 0,
            };
            return result;
        }, {});
    }

    public deleteJob = async (jobId: string) => {
        await JobPostModel.deleteOne({ _id: jobId }).exec();
    }

    public deleteCandidate = async (candidateId: string) => {
        const objectId = new Types.ObjectId(candidateId);
        await CandidateModel.deleteOne({ userId: objectId }).exec();
        await UserModel.deleteOne({ _id: objectId }).exec();
        await ApplicantModel.deleteMany({ userId: objectId }).exec();
    }

    public deleteCompany = async (recruiterId: string) => {
        const objectId = new Types.ObjectId(recruiterId);
        await RecruiterModel.deleteOne({ userId: objectId }).exec();
        await UserModel.deleteOne({ _id: objectId }).exec();
        await JobPostModel.deleteMany({ userId: objectId }).exec();
    }

    public searchJobs = async (query: string) => {
        return await JobPostModel.aggregate([
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
    }

    public searchCandidates = async (query: string) => {
        return await CandidateModel.aggregate([
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
    }

    public searchCompanies = async (query: string) => {
        return await RecruiterModel.aggregate([
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
    }
}
