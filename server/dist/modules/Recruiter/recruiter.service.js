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
const bcrypt_1 = __importDefault(require("bcrypt"));
const EnumUserRole_1 = __importDefault(require("../../types/EnumUserRole"));
const recruiter_model_1 = require("../../models/recruiter.model");
const user_model_1 = require("../../models/user.model");
const console_1 = require("console");
const saltRounds = 10;
// Helper function to find recruiter
const handleFindRecruiter = (criteria, errorMessage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recruiter = yield recruiter_model_1.Recruiter.findById(criteria).exec();
        (0, console_1.log)(recruiter, criteria);
        return recruiter;
    }
    catch (error) {
        console.error(errorMessage, error);
        throw new Error(errorMessage);
    }
});
// Helper function to create user
const createUser = (privateEmail, hashedPwd, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_model_1.User({
            privateEmail,
            password: hashedPwd,
            role: EnumUserRole_1.default.RECRUITER,
            phoneNumber,
        });
        yield user.save();
        return user;
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
});
// Helper function to create recruiter
const createRecruiter = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, phoneNumber, orgTaxNumber, orgName, orgField, orgScale, orgAddress }) {
    try {
        const recruiter = new recruiter_model_1.Recruiter({
            userId,
            phoneNumber,
            orgTaxNumber,
            orgName,
            orgField,
            orgScale,
            orgAddress,
            createdAt: new Date()
        });
        yield recruiter.save();
        return recruiter;
    }
    catch (error) {
        console.error('Error creating recruiter:', error);
        throw new Error('Failed to create recruiter');
    }
});
const RecruiterService = {
    getRecruiterById: (recruiterId) => __awaiter(void 0, void 0, void 0, function* () {
        return handleFindRecruiter(recruiterId, 'Error fetching recruiter by userId');
    }),
    getRecruiterByEmail: (privateEmail) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_model_1.User.findOne({ privateEmail }).select('_id').exec();
        if (!user)
            return null;
        const userId = user._id;
        return handleFindRecruiter({ userId }, 'Error fetching recruiter by email');
    }),
    createRecruiter: (privateEmail, password, phoneNumber, orgTaxNumber, orgName, orgField, orgScale, orgAddress) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hashedPwd = yield bcrypt_1.default.hash(password, saltRounds);
            const user = yield createUser(privateEmail, hashedPwd, phoneNumber);
            const recruiter = yield createRecruiter({
                userId: String(user._id),
                phoneNumber,
                orgTaxNumber,
                orgName,
                orgField,
                orgScale,
                orgAddress
            });
            return recruiter;
        }
        catch (error) {
            console.error('Error creating recruiter:', error);
            throw new Error('Failed to create recruiter');
        }
    }),
};
exports.default = RecruiterService;
