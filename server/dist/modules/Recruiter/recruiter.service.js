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
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const IUserRole_1 = __importDefault(require("../../types/IUserRole"));
const saltRounds = 10;
const prisma = new client_1.PrismaClient();
const RecruiterService = {
    // Recruiter
    getAllRecruiters: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.recruiter.findMany();
    }),
    getRecruiterById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.recruiter.findUnique({
            where: { recruiter_id: id }
        });
    }),
    getRecruiterByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.recruiter.findUnique({
            where: {
                org_email: email,
            },
        });
    }),
    createRecruiter: (email, mobile, password, tax_number, org_name, org_field, org_scale, org_address, org_image_url) => __awaiter(void 0, void 0, void 0, function* () {
        const recruiterId = (0, uuid_1.v4)();
        const hashedPwd = yield bcrypt_1.default.hash(password, saltRounds);
        return yield prisma.recruiter.create({
            data: {
                recruiter_id: recruiterId,
                org_email: email,
                org_mobile: mobile,
                org_password: hashedPwd,
                role: IUserRole_1.default.RECRUITER,
                org_tax_number: tax_number,
                org_name,
                org_field,
                org_scale,
                org_address,
                org_image: org_image_url
            }
        });
    }),
    changePassword: (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hashedPwd = yield bcrypt_1.default.hash(newPassword, saltRounds);
            yield prisma.recruiter.update({
                where: { recruiter_id: userId },
                data: { org_password: hashedPwd },
            });
        }
        catch (error) {
        }
    })
};
exports.default = RecruiterService;
