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
const candidate_service_1 = __importDefault(require("./candidate.service"));
const console_1 = require("console");
const candidate_validation_1 = require("../../utils/validations/candidate.validation");
const handleError_1 = require("../../utils/errors/handleError");
const CandidateController = {
    getCandidateById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate candidateId in params
            const { error } = candidate_validation_1.CandidateValidation.candidateIdSchema.validate(req.params);
            if ((0, handleError_1.handleValidationError)(error, res))
                return;
            const candidateId = req.params.candidateId;
            const result = yield candidate_service_1.default.getCandidateById(candidateId);
            // Handle result from service
            if ((0, handleError_1.handleServiceResult)(result, res, "Candidate not found!"))
                return;
            res.status(200).json({ success: true, result });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal server error!" });
        }
    }),
    getCandidatesApplied: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate jobId in params
            if ((0, handleError_1.handleValidationError)(candidate_validation_1.CandidateValidation.jobIdSchema.validate(req.params), res))
                return;
            const jobId = req.params.id;
            const result = yield candidate_service_1.default.getCandidatesApplied(jobId);
            // Handle result from service
            if ((0, handleError_1.handleServiceResult)(result, res, "Candidates not found!"))
                return;
            res.status(200).json({ success: true, result });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal server error!" });
        }
    }),
    submitProfessionalDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate professional details in body
            // const { error } = CandidateValidation.candidateProfessionalDetailsSchema.validate(req.body);
            // if (handleValidationError(error, res)) return;
            const { candidateId, fullName, jobPosition, publicEmail, phoneNumber, gender, birthDate, avatarUrl, address, linkedinUrl, githubUrl, personalDescription, languages, projects, certifications, programmingSkills, educations, experiences } = req.body;
            // Update personal and professional profiles
            const [personalProfile, professionalProfile] = yield Promise.all([
                candidate_service_1.default.updateCandidatePersonalProfile(candidateId, fullName, jobPosition, publicEmail, phoneNumber, Boolean(gender), birthDate, avatarUrl, address, linkedinUrl, githubUrl, personalDescription),
                candidate_service_1.default.updateCandidateProfessionalProfile(candidateId, languages, projects, certifications, programmingSkills, educations, experiences)
            ]);
            // Handle service result
            if (!personalProfile || !professionalProfile) {
                res.status(500).json({ success: false, message: "Something went wrong!" });
                return;
            }
            res.status(200).json({ success: true, message: "Updated successfully!" });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal server error!" });
        }
    }),
    removeObjectFromArray: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { candidateId, field, objectId } = req.body;
            const result = yield candidate_service_1.default.removeObjectFromArray(candidateId, field, objectId);
            if (!result) {
                res.status(500).json({ success: false, message: "Something went wrong!" });
                return;
            }
            res.status(200).json({ success: true, message: "Removed successfully!" });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, message: "Internal server error!" });
        }
    })
};
exports.default = CandidateController;
