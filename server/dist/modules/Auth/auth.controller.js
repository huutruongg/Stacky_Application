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
const auth_service_1 = __importDefault(require("./auth.service"));
const recruiter_service_1 = __importDefault(require("../Recruiter/recruiter.service"));
dotenv_1.default.config();
const AuthController = {
    signupRecruiter: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, mobile, password, tax_number, org_name, org_field, org_scale, org_address, org_image_url } = req.body;
        try {
            const existingUser = yield recruiter_service_1.default.getRecruiterByEmail(email);
            if (existingUser) {
                res.status(401).json({ message: "This email already exists! Please enter another email." });
                return;
            }
            const recruiter = yield recruiter_service_1.default.createRecruiter(email, mobile, password, tax_number, org_name, org_field, org_scale, org_address, org_image_url);
            if (!recruiter) {
                res.status(500).json({ message: "Failed to create recruiter." });
                return;
            }
            const token = auth_service_1.default.generateToken(recruiter.recruiter_id, recruiter.org_email, recruiter.role);
            res.status(200).json({
                success: true,
                data: {
                    userId: recruiter.recruiter_id,
                    email: recruiter.org_email,
                    token,
                },
            });
        }
        catch (err) {
            console.error(err);
            return next(new Error("Error! Something went wrong."));
        }
    }),
    login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const existingUser = yield recruiter_service_1.default.getRecruiterByEmail(email);
            if (!existingUser) {
                res.status(401).json({ message: "User not found!" });
                return;
            }
            const isValidPassword = yield auth_service_1.default.checkPassword(password, existingUser.org_password);
            if (!isValidPassword) {
                res.status(401).json({ message: "Invalid credentials!" });
                return;
            }
            const jwtToken = auth_service_1.default.generateToken(existingUser.recruiter_id, existingUser.org_email, existingUser.role);
            res.status(200).json({
                success: true,
                data: {
                    userId: existingUser.recruiter_id,
                    email: existingUser.org_email,
                    role: existingUser.role,
                    token: jwtToken,
                },
            });
        }
        catch (err) {
            console.error(err);
            return next(new Error("Error! Something went wrong."));
        }
    }),
    loginCandidateOAuth: (provider) => (req, res, next) => {
        passport_1.default.authenticate(provider, { session: false }, (err, user) => {
            if (err || !user) {
                return res.status(401).json({ success: false, message: 'Authentication failed' });
            }
            const jwtToken = auth_service_1.default.generateToken(user.candidate_id, user.email, user.role);
            return res.status(200).json({ success: true, token: jwtToken });
        })(req, res, next);
    },
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ success: false, message: 'Something went wrong!' });
                return;
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ success: true, message: 'Logout successfull!' });
            return;
        });
    })
};
exports.default = AuthController;
