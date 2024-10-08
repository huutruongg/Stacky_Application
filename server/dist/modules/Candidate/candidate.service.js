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
const candidate_model_1 = require("./../../models/candidate.model");
const application_model_1 = require("../../models/application.model");
const mongoose_1 = require("mongoose");
const CandidateService = {
    getCandidates: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const candidates = yield candidate_model_1.Candidate.find().populate('userId').exec();
            return candidates.length > 0 ? candidates : null;
        }
        catch (error) {
            logError("Error fetching candidates:", error);
            return null;
        }
    }),
    getCandidateById: (candidateId) => __awaiter(void 0, void 0, void 0, function* () {
        return handleFindCandidateById(candidateId);
    }),
    getCandidatesApplied: (jobId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const applications = yield application_model_1.Application.find({ jobId }).exec();
            if (!applications || applications.length === 0) {
                return null;
            }
            const userIds = applications.map((app) => app.candidateId);
            const candidates = yield candidate_model_1.Candidate.find({ userId: { $in: userIds } }).populate('userId').exec();
            return candidates.length > 0 ? candidates : null;
        }
        catch (error) {
            logError("Error fetching candidates who applied for the job:", error);
            return null;
        }
    }),
    updateOauth: (provider, providerId, accessToken, userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const candidate = yield handleFindCandidateByUserId(userId);
            if (!candidate)
                throw new Error("Candidate not found");
            const existingTokenIndex = candidate.oauthTokens.findIndex(token => token.provider === provider && token.providerId === providerId);
            if (existingTokenIndex !== -1) {
                candidate.oauthTokens[existingTokenIndex].accessToken = accessToken;
            }
            else {
                candidate.oauthTokens.push({
                    provider,
                    providerId,
                    accessToken
                });
            }
            yield candidate.save();
        }
        catch (error) {
            logError("Error updating OAuth token:", error);
            throw new Error("Failed to update OAuth token");
        }
    }),
    updateCandidatePersonalProfile: (candidateId, fullName, jobPosition, publicEmail, phoneNumber, gender, birthDate, avatar, address, linkedinUrl, githubUrl, personalDescription) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updateFields = {
                fullName,
                jobPosition,
                publicEmail,
                phoneNumber,
                gender,
                birthDate,
                avatar,
                address,
                linkedinUrl,
                githubUrl,
                personalDescription
            };
            return yield updateCandidateProfile(candidateId, updateFields);
        }
        catch (error) {
            logError("Error updating candidate personal profile:", error);
            return false;
        }
    }),
    updateCandidateProfessionalProfile: (candidateId_1, ...args_1) => __awaiter(void 0, [candidateId_1, ...args_1], void 0, function* (candidateId, languages = [], projects = [], certifications = [], programmingSkills = '', educations = [], experiences = []) {
        const MAX_RETRIES = 3;
        let attempts = 0;
        let success = false;
        while (attempts < MAX_RETRIES && !success) {
            const session = yield (0, mongoose_1.startSession)();
            session.startTransaction();
            try {
                const candidate = yield handleFindCandidateById(candidateId, session);
                if (!candidate)
                    throw new Error("Candidate not found");
                // Call update functions for each field
                if (languages.length > 0)
                    updateLanguages(candidate, languages);
                if (projects.length > 0)
                    updateProjects(candidate, projects);
                if (certifications.length > 0)
                    updateCertifications(candidate, certifications);
                if (programmingSkills)
                    updateProgrammingSkills(candidate, programmingSkills);
                if (educations.length > 0)
                    updateEducations(candidate, educations);
                if (experiences.length > 0)
                    updateExperiences(candidate, experiences);
                // Save the candidate with updated information
                yield candidate.save({ session });
                // Commit transaction
                yield session.commitTransaction();
                success = true;
                return true;
            }
            catch (error) {
                yield handleTransactionError(session, "Error updating candidate professional profile:", error);
                if (error.errorLabels && error.errorLabels.includes('TransientTransactionError')) {
                    attempts++;
                    console.warn(`Retry attempt ${attempts} due to transient error`);
                }
                else {
                    console.error("Non-transient error, aborting operation.");
                    return false;
                }
            }
            finally {
                session.endSession();
            }
        }
        if (!success) {
            console.error(`Failed to update candidate profile after ${MAX_RETRIES} attempts.`);
            return false;
        }
        return true;
    }),
    getUrlReposSharedByCandidateId: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const candidate = yield candidate_model_1.Candidate.findById(id).select('projects').exec();
            if (!candidate || !candidate.projects) {
                return null;
            }
            const urls = candidate.projects
                .map(p => p.urlRepo)
                .filter((url) => url != null && url !== '');
            return urls.length > 0 ? urls : null;
        }
        catch (error) {
            logError("Error fetching URLs shared by candidate:", error);
            return null;
        }
    }),
    getAccessTokenGithub: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const candidate = yield candidate_model_1.Candidate.findOne({ _id: id }).select('oauthTokens').exec();
            if (!candidate || !candidate.oauthTokens)
                return null;
            const githubToken = candidate.oauthTokens.find(token => token.provider === 'GITHUB');
            return githubToken ? githubToken.accessToken : null;
        }
        catch (error) {
            logError("Error fetching GitHub access token:", error);
            return null;
        }
    }),
    removeObjectFromArray: (candidateId, field, objectId) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            // Find the candidate first to ensure it exists
            const candidate = yield candidate_model_1.Candidate.findById(candidateId).session(session);
            if (!candidate) {
                console.error(`Candidate with ID ${candidateId} not found`);
                return false; // Early return if the candidate doesn't exist
            }
            // Check if the object with the provided objectId exists in the specified field
            const objectExists = candidate[field].some((item) => item._id.toString() === objectId);
            if (!objectExists) {
                console.error(`Object with ID ${objectId} not found in ${field} for candidate ${candidateId}`);
                return false; // Early return if the object is not found
            }
            // Proceed to remove the object
            const update = {
                $pull: { [field]: { _id: objectId } },
            };
            const updatedCandidate = yield candidate_model_1.Candidate.findOneAndUpdate({ _id: candidateId }, update, { session, new: true } // new: true returns the updated document
            );
            if (!updatedCandidate) {
                console.error(`Failed to update candidate with ID ${candidateId}`);
                throw new Error('Failed to update candidate');
            }
            // Commit transaction
            yield session.commitTransaction();
            return true;
        }
        catch (error) {
            yield handleTransactionError(session, "Error updating candidate professional profile:", error);
            return false;
        }
        finally {
            session.endSession();
        }
    })
};
// Helper function to log errors
const logError = (message, error) => {
    console.error(message, error);
};
// Helper function to find candidate by id with optional session
const handleFindCandidateById = (candidateId, session) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield candidate_model_1.Candidate.findById(candidateId).session(session || null).exec();
    }
    catch (error) {
        logError("Error fetching candidate by ID:", error);
        return null;
    }
});
// Helper function to find candidate by userId
const handleFindCandidateByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield candidate_model_1.Candidate.findOne({ userId }).exec();
    }
    catch (error) {
        logError("Error fetching candidate by userId:", error);
        return null;
    }
});
// Helper function to update candidate profile
const updateCandidateProfile = (candidateId, updateFields) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield candidate_model_1.Candidate.findByIdAndUpdate(candidateId, updateFields, { new: true });
        if (!result)
            throw new Error("Failed to update candidate profile");
        return true;
    }
    catch (error) {
        logError("Error updating candidate profile:", error);
        return false;
    }
});
// Helper function to handle transaction errors
const handleTransactionError = (session, message, error) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(message, error);
    yield session.abortTransaction();
});
const updateOrInsertArrayFieldById = (existingItems, newItems) => {
    newItems.forEach((newItem) => {
        if (newItem._id) {
            // Find and update the existing item by _id
            const existingItemIndex = existingItems.findIndex((item) => item._id.toString() === newItem._id.toString());
            if (existingItemIndex !== -1) {
                existingItems[existingItemIndex] = newItem; // Update the existing item
            }
            else {
                existingItems.push(newItem); // If _id exists but not found, insert it
            }
        }
        else {
            // If no _id is provided, treat it as a new item and push it
            existingItems.push(newItem);
        }
    });
};
const updateLanguages = (candidate, languages) => {
    updateOrInsertArrayFieldById(candidate.languages, languages);
};
const updateProjects = (candidate, projects) => {
    updateOrInsertArrayFieldById(candidate.projects, projects);
};
const updateCertifications = (candidate, certifications) => {
    updateOrInsertArrayFieldById(candidate.certifications, certifications);
};
const updateEducations = (candidate, educations) => {
    updateOrInsertArrayFieldById(candidate.educations, educations);
};
const updateExperiences = (candidate, experiences) => {
    updateOrInsertArrayFieldById(candidate.experiences, experiences);
};
const updateProgrammingSkills = (candidate, programmingSkills) => {
    candidate.programmingSkills = programmingSkills;
};
exports.default = CandidateService;
