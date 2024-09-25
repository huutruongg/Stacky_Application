"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JobPostingService = {
    getJDById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const jobPost = yield prisma.job_Post.findUnique({
                where: { job_id: id },
            });
            if (!jobPost) {
                console.warn(`Job posting with ID ${id} not found.`);
            }
            return jobPost;
        }
        catch (error) {
            console.error(`Error fetching job posting with ID ${id}:`, error);
            return null;
        }
    }),
    findJobPostingsByJobPosition: (key) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield prisma.job_Post.findMany({
                where: {
                    job_title: {
                        contains: key,
                        mode: 'insensitive',
                    },
                },
            });
            return data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }),
    filterJobPostingByLocation: (location) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield prisma.job_Post.findMany({
                where: {
                    recruiter: {
                        org_address: location
                    }
                },
                include: {
                    recruiter: {
                        select: {
                            org_address: true,
                        }
                    }
                }
            });
            return data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }),
    filterJobPostingByIndustry: (industry) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield prisma.job_Post.findMany({
                where: {
                    type_of_industry: industry
                },
            });
            return data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }),
    getAllJobsPosted: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield prisma.job_Post.findMany({
                where: {
                    recruiter_id: userId
                }
            });
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }),
    getAllJobPostingsByPage: (page, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield prisma.job_Post.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize
            });
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }),
    deleteJobPosting: (jobId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield prisma.job_Post.delete({
                where: {
                    job_id: jobId
                }
            });
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    })
};
exports.default = JobPostingService;
