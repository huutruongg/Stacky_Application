import { log } from 'console';
import { ICandidate } from '../../types/ICandidate';
import { ICertification, IEducation, IExperience, ILanguage, IProject } from '../../types/ICandidate.d';
import { Candidate } from '../../models/candidate.model';
import { Application } from '../../models/application.model';
import { IApplication } from '../../types/IApplication';
import { startSession, ClientSession } from 'mongoose';

const CandidateService = {

    getCandidates: async (): Promise<ICandidate[] | null> => {
        try {
            const candidates = await Candidate.find().populate('userId').exec();
            return candidates.length > 0 ? candidates : null;
        } catch (error) {
            logError("Error fetching candidates:", error);
            return null;
        }
    },

    getCandidateById: async (candidateId: string): Promise<ICandidate | null> => {
        return handleFindCandidateById(candidateId);
    },

    getCandidatesApplied: async (jobId: string): Promise<ICandidate[] | null> => {
        try {
            const applications = await Application.find({ jobId }).exec();

            if (!applications || applications.length === 0) {
                return null;
            }

            const userIds = applications.map((app: IApplication) => app.candidateId);
            const candidates = await Candidate.find({ userId: { $in: userIds } }).populate('userId').exec();
            return candidates.length > 0 ? candidates : null;
        } catch (error) {
            logError("Error fetching candidates who applied for the job:", error);
            return null;
        }
    },

    updateOauth: async (provider: string, providerId: string, accessToken: string, userId: string): Promise<void> => {
        try {
            const candidate = await handleFindCandidateByUserId(userId);
            if (!candidate) throw new Error("Candidate not found");

            const existingTokenIndex = candidate.oauthTokens.findIndex(
                token => token.provider === provider && token.providerId === providerId
            );

            if (existingTokenIndex !== -1) {
                candidate.oauthTokens[existingTokenIndex].accessToken = accessToken;
            } else {
                candidate.oauthTokens.push({
                    provider,
                    providerId,
                    accessToken
                });
            }

            await candidate.save();
        } catch (error) {
            logError("Error updating OAuth token:", error);
            throw new Error("Failed to update OAuth token");
        }
    },

    updateCandidatePersonalProfile: async (
        candidateId: string,
        fullName: string,
        jobPosition: string,
        publicEmail: string,
        phoneNumber: string,
        gender: boolean,
        birthDate: Date,
        avatar: string,
        address: string,
        linkedinUrl: string,
        githubUrl: string,
        personalDescription: string
    ): Promise<boolean> => {
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

            return await updateCandidateProfile(candidateId, updateFields);
        } catch (error) {
            logError("Error updating candidate personal profile:", error);
            return false;
        }
    },

    updateCandidateProfessionalProfile: async (
        candidateId: string,
        languages: ILanguage[],
        projects: IProject[],
        certifications: ICertification[],
        programmingSkills: string,
        educations: IEducation[],
        experiences: IExperience[]
    ): Promise<boolean> => {
        const session = await startSession();
        session.startTransaction();
        try {
            const candidate = await handleFindCandidateById(candidateId, session);
            if (!candidate) throw new Error("Candidate not found");

            candidate.languages = languages;
            candidate.projects = projects;
            candidate.certifications = certifications;
            candidate.programmingSkills = programmingSkills;
            candidate.educations = educations;
            candidate.experiences = experiences;

            await candidate.save({ session });

            // Commit transaction
            await session.commitTransaction();
            return true;
        } catch (error) {
            await handleTransactionError(session, "Error updating candidate professional profile:", error);
            return false;
        } finally {
            session.endSession();
        }
    },

    getUrlReposSharedByCandidateId: async (id: string): Promise<string[] | null> => {
        try {
            const candidate = await Candidate.findById(id).select('projects').exec();

            if (!candidate || !candidate.projects) {
                return null;
            }

            const urls = candidate.projects
                .map(p => p.urlRepo)
                .filter((url): url is string => url != null && url !== '');

            return urls.length > 0 ? urls : null;
        } catch (error) {
            logError("Error fetching URLs shared by candidate:", error);
            return null;
        }
    },

    getAccessTokenGithub: async (id: string): Promise<string | null> => {
        try {
            const candidate = await Candidate.findOne({ _id: id }).select('oauthTokens').exec();
            if (!candidate || !candidate.oauthTokens) return null;

            const githubToken = candidate.oauthTokens.find(token => token.provider === 'GITHUB');
            return githubToken ? githubToken.accessToken : null;
        } catch (error) {
            logError("Error fetching GitHub access token:", error);
            return null;
        }
    }
};

// Helper function to log errors
const logError = (message: string, error: any) => {
    console.error(message, error);
};

// Helper function to find candidate by id with optional session
const handleFindCandidateById = async (candidateId: string, session?: ClientSession): Promise<ICandidate | null> => {
    try {
        return await Candidate.findById(candidateId).session(session || null).exec();
    } catch (error) {
        logError("Error fetching candidate by ID:", error);
        return null;
    }
};

// Helper function to find candidate by userId
const handleFindCandidateByUserId = async (userId: string): Promise<ICandidate | null> => {
    try {
        return await Candidate.findOne({ userId }).exec();
    } catch (error) {
        logError("Error fetching candidate by userId:", error);
        return null;
    }
};

// Helper function to update candidate profile
const updateCandidateProfile = async (candidateId: string, updateFields: object): Promise<boolean> => {
    try {
        const result = await Candidate.findByIdAndUpdate(candidateId, updateFields, { new: true });
        if (!result) throw new Error("Failed to update candidate profile");
        return true;
    } catch (error) {
        logError("Error updating candidate profile:", error);
        return false;
    }
};

// Helper function to handle transaction errors
const handleTransactionError = async (session: ClientSession, message: string, error: any) => {
    console.error(message, error);
    await session.abortTransaction();
};

export default CandidateService;
