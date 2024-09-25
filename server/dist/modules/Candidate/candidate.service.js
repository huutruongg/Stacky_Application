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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const IUserRole_1 = __importDefault(require("../../types/IUserRole"));
const prisma = new client_1.PrismaClient();
const CandidateService = {
    getAllCandidates: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.candidate.findMany();
    }),
    getCandidateById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.candidate.findUnique({
            where: { candidate_id: id }
        });
    }),
    getCandidateByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.candidate.findUnique({
            where: { email }
        });
    }),
    createCandidate: (email, username) => __awaiter(void 0, void 0, void 0, function* () {
        const candidateId = (0, uuid_1.v4)();
        return yield prisma.candidate.create({
            data: {
                candidate_id: candidateId,
                email,
                username,
                role: IUserRole_1.default.CANDIDATE
            }
        });
    }),
    updateOauth: (provider, providerId, accessToken, candidateId) => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            access_token: accessToken,
            created_at: new Date(),
        };
        yield prisma.oauth_Token.upsert({
            where: {
                candidate_id_provider: { candidate_id: candidateId, provider }
            },
            update: data,
            create: Object.assign(Object.assign({ provider, provider_id: providerId }, data), { candidate_id: candidateId }),
        });
    }),
    getCandidatesByPage: (page, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.candidate.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize
        });
    }),
    getUrlReposSharedByCandidateId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const projects = yield prisma.c_Project.findMany({
            where: { candidate_id: id },
            select: { url_repo: true }
        });
        // Return the extracted urls or null if no projects found
        return projects.length > 0 ? projects.map(p => p.url_repo) : null;
    }),
    getAccessTokenGithub: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { access_token } = (yield prisma.oauth_Token.findFirst({
                where: {
                    candidate_id: id,
                    provider: "GITHUB"
                },
                select: { access_token: true }
            })) || {}; // Use destructuring to handle the case where data is null
            return access_token || null; // Return access_token or null if it doesn't exist
        }
        catch (error) {
            console.error("Error fetching GitHub access token:", error);
            return null; // Return null if there's an error
        }
    })
};
exports.default = CandidateService;
