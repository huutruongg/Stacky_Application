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
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const console_1 = require("console");
const auth_service_1 = __importDefault(require("./auth.service"));
const recruiter_service_1 = __importDefault(require("../Recruiter/recruiter.service"));
const EnumUserRole_1 = __importDefault(require("../../types/EnumUserRole"));
const auth_validation_1 = require("../../utils/validations/auth.validation");
const handleError_1 = require("../../utils/errors/handleError");
dotenv_1.default.config();
const AuthController = {
    signupRecruiter: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = auth_validation_1.AuthValidation.signupRecruiterSchema.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json({ success: false, message: error.details[0].message });
                return;
            }
            const { privateEmail, password, phoneNumber, orgTaxNumber, orgName, orgField, orgScale, orgAddress, } = req.body;
            const existingUser = yield auth_service_1.default.getUserByEmail(privateEmail);
            if (existingUser) {
                res
                    .status(409)
                    .json({
                    success: false,
                    message: "This email already exists! Please enter another email.",
                });
                return;
            }
            const recruiter = yield recruiter_service_1.default.createRecruiter(privateEmail, password, phoneNumber, orgTaxNumber, orgName, orgField, orgScale, orgAddress);
            if (!recruiter) {
                res
                    .status(500)
                    .json({ success: false, message: "Failed to create recruiter." });
                return;
            }
            const accessToken = auth_service_1.default.generateAccessToken(recruiter.userId, privateEmail, EnumUserRole_1.default.RECRUITER);
            const refreshToken = auth_service_1.default.generateRefreshToken(recruiter.userId, privateEmail, EnumUserRole_1.default.RECRUITER);
            res.status(200).json({
                userId: recruiter.userId,
                email: privateEmail,
                accessToken,
                refreshToken,
            });
        }
        catch (err) {
            return (0, handleError_1.handleServiceError)(err, res, next);
        }
    }),
    recruiterLogin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = auth_validation_1.AuthValidation.loginSchema.validate(req.body);
            if ((0, handleError_1.handleValidationError)(error, res))
                return;
            const { email, password } = req.body;
            const existingUser = yield auth_service_1.default.getUserByEmail(email);
            if (!existingUser) {
                res.status(401).json({ success: false, message: "User not found!" });
                return;
            }
            const isValidPassword = yield auth_service_1.default.checkPassword(password, String(existingUser.password));
            if (!isValidPassword) {
                res
                    .status(401)
                    .json({ success: false, message: "Invalid credentials!" });
                return;
            }
            const accessToken = auth_service_1.default.generateAccessToken(String(existingUser._id), existingUser.privateEmail, existingUser.role);
            const refreshToken = auth_service_1.default.generateRefreshToken(existingUser._id, existingUser.privateEmail, existingUser.role);
            res.status(200).json({
                userId: existingUser._id,
                email: existingUser.privateEmail,
                role: existingUser.role,
                accessToken,
                refreshToken,
            });
        }
        catch (err) {
            return (0, handleError_1.handleServiceError)(err, res, next);
        }
    }),
    loginCandidateOAuth: (provider) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            passport_1.default.authenticate(provider, { session: false }, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
                if (err || !user) {
                    (0, console_1.log)(err);
                    res
                        .status(401)
                        .json({ success: false, message: "Authentication failed" });
                    return;
                }
                const candidate = yield auth_service_1.default.getUserById(String(user._id));
                if (!candidate) {
                    res
                        .status(401)
                        .json({ success: false, message: "Authentication failed" });
                    return;
                }
                const accessToken = auth_service_1.default.generateAccessToken(String(candidate._id), candidate.privateEmail, candidate.role);
                const refreshToken = auth_service_1.default.generateRefreshToken(String(candidate._id), candidate.privateEmail, candidate.role);
                req.session.accessToken = accessToken;
                req.session.refreshToken = refreshToken;
                res.redirect("http://localhost:5173/account.stacky.vn?token=true");
            }))(req, res, next);
        }
        catch (error) {
            return (0, handleError_1.handleServiceError)(error, res, next);
        }
    }),
    adminLogin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = auth_validation_1.AuthValidation.loginSchema.validate(req.body);
            if ((0, handleError_1.handleValidationError)(error, res))
                return;
            const { email, password } = req.body;
            const existingUser = yield auth_service_1.default.getUserByEmail(email);
            if (!existingUser) {
                res.status(401).json({ message: "User not found!" });
                return;
            }
            const isValidPassword = yield auth_service_1.default.checkPassword(password, String(existingUser.password));
            if (!isValidPassword) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }
            const accessToken = auth_service_1.default.generateAccessToken(String(existingUser._id), existingUser.privateEmail, existingUser.role);
            const refreshToken = auth_service_1.default.generateRefreshToken(String(existingUser._id), existingUser.privateEmail, existingUser.role);
            res.status(200).json({
                userId: existingUser._id,
                email: existingUser.privateEmail,
                role: existingUser.role,
                accessToken,
                refreshToken,
            });
        }
        catch (err) {
            return (0, handleError_1.handleServiceError)(err, res, next);
        }
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        req.session.destroy((err) => {
            if (err) {
                res
                    .status(500)
                    .json({ success: false, message: "Something went wrong!" });
                return;
            }
            res.clearCookie("connect.sid");
            res.status(200).json({ success: true, message: "Logout successful!" });
        });
    }),
    getTokens: (req, res) => {
        var _a, _b;
        const accessToken = (_a = req.session) === null || _a === void 0 ? void 0 : _a.accessToken;
        const refreshToken = (_b = req.session) === null || _b === void 0 ? void 0 : _b.refreshToken;
        if (!accessToken || !refreshToken) {
            return res
                .status(401)
                .json({ success: false, message: "No tokens found" });
        }
        res.status(200).json({
            accessToken,
            refreshToken,
        });
    },
};
exports.default = AuthController;
