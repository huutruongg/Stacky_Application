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
const admin_model_1 = require("./../../models/admin.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const recruiter_model_1 = require("../../models/recruiter.model");
const EnumUserRole_1 = __importDefault(require("../../types/EnumUserRole"));
const user_model_1 = require("../../models/user.model");
const candidate_model_1 = require("../../models/candidate.model");
const saltRounds = 10;
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const AuthService = {
    checkPassword: (pwdRequest, hashedPwd) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield bcrypt_1.default.compare(pwdRequest, hashedPwd);
        }
        catch (error) {
            console.error('Password comparison failed:', error);
            return false;
        }
    }),
    generateAccessToken: (userId, email, role) => {
        const payload = { userId, email, role };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    },
    generateRefreshToken: (userId, email, role) => {
        const payload = { userId, email, role };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
    },
    verifyOAuthToken: (provider, token) => __awaiter(void 0, void 0, void 0, function* () {
        if (provider !== 'google') {
            throw new Error('Unsupported provider');
        }
        try {
            const ticket = yield client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error('Invalid Google token');
            }
            return {
                email: payload.email,
                name: payload.name,
                provider,
                token,
            };
        }
        catch (error) {
            console.error('OAuth token verification failed:', error);
            throw new Error('Token verification failed');
        }
    }),
    createAdmin: (privateEmail, password) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hashedPassword = yield AuthService.hashPassword(password);
            const user = yield AuthService.saveUser(privateEmail, hashedPassword, EnumUserRole_1.default.ADMIN);
            if (!user)
                throw new Error('Failed to create admin user');
            const admin = new admin_model_1.Admin({ userId: user._id });
            yield admin.save();
            return admin;
        }
        catch (error) {
            console.error('Error creating admin:', error);
            return null;
        }
    }),
    changePassword: (userId, newPassword, role) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hashedPwd = yield AuthService.hashPassword(newPassword);
            let model;
            if (role === EnumUserRole_1.default.ADMIN) {
                model = admin_model_1.Admin;
            }
            else if (role === EnumUserRole_1.default.RECRUITER) {
                model = recruiter_model_1.Recruiter;
            }
            else {
                throw new Error("Invalid role provided");
            }
            yield model.updateOne({ _id: userId }, { $set: { password: hashedPwd } });
        }
        catch (error) {
            console.error('Error updating password:', error);
            throw new Error("Password update failed");
        }
    }),
    hashPassword: (password) => __awaiter(void 0, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(password, saltRounds);
    }),
    getUserById: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield user_model_1.User.findById(userId).exec();
        }
        catch (error) {
            console.error('Error finding user by ID:', error);
            return null;
        }
    }),
    getUserByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield user_model_1.User.findOne({ privateEmail: email }).exec();
        }
        catch (error) {
            console.error('Error finding user by email:', error);
            return null;
        }
    }),
    createCandidateUser: (privateEmail, fullName) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield AuthService.saveUser(privateEmail, '', EnumUserRole_1.default.CANDIDATE); // No password for OAuth
            if (!user)
                throw new Error('Failed to create candidate user');
            const candidate = new candidate_model_1.Candidate({
                userId: user._id,
                fullName
            });
            yield candidate.save();
            return user;
        }
        catch (error) {
            console.error('Error creating candidate user:', error);
            return null;
        }
    }),
    // Helper function to save a user
    saveUser: (privateEmail, password, role) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = new user_model_1.User({
                privateEmail,
                password,
                role
            });
            yield user.save();
            return user;
        }
        catch (error) {
            console.error('Error saving user:', error);
            return null;
        }
    })
};
exports.default = AuthService;
