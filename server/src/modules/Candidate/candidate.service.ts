import { Candidate } from '../../models/candidate.model';
import { log } from 'console';
import { ICandidate } from '../../types/ICandidate';
import { ICertification, IEducation, IExperience, ILanguage, IProject } from '../../types/ICandidate';
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
        languages: ILanguage[] = [],
        projects: IProject[] = [],
        certifications: ICertification[] = [],
        programmingSkills: string = '',
        educations: IEducation[] = [],
        experiences: IExperience[] = []
    ): Promise<boolean> => {
        const MAX_RETRIES = 3;
        let attempts = 0;
        let success = false;

        while (attempts < MAX_RETRIES && !success) {
            const session = await startSession();
            session.startTransaction();

            try {
                const candidate = await handleFindCandidateById(candidateId, session);
                if (!candidate) throw new Error("Candidate not found");

                // Call update functions for each field
                if (languages.length > 0) updateLanguages(candidate, languages);
                if (projects.length > 0) updateProjects(candidate, projects);
                if (certifications.length > 0) updateCertifications(candidate, certifications);
                if (programmingSkills) updateProgrammingSkills(candidate, programmingSkills);
                if (educations.length > 0) updateEducations(candidate, educations);
                if (experiences.length > 0) updateExperiences(candidate, experiences);

                // Save the candidate with updated information
                await candidate.save({ session });

                // Commit transaction
                await session.commitTransaction();
                success = true;
                return true;
            } catch (error: any) {
                await handleTransactionError(session, "Error updating candidate professional profile:", error);

                if (error.errorLabels && error.errorLabels.includes('TransientTransactionError')) {
                    attempts++;
                    console.warn(`Retry attempt ${attempts} due to transient error`);
                } else {
                    console.error("Non-transient error, aborting operation.");
                    return false;
                }
            } finally {
                session.endSession();
            }
        }

        if (!success) {
            console.error(`Failed to update candidate profile after ${MAX_RETRIES} attempts.`);
            return false;
        }
        return true;
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
    },

    removeObjectFromArray: async (
        candidateId: string,
        field: 'projects' | 'educations' | 'certifications' | 'experiences' | 'languages',
        objectId: string
    ): Promise<boolean> => {
        const session = await startSession();
        session.startTransaction();
        try {
            // Find the candidate first to ensure it exists
            const candidate = await Candidate.findById(candidateId).session(session);

            if (!candidate) {
                console.error(`Candidate with ID ${candidateId} not found`);
                return false; // Early return if the candidate doesn't exist
            }

            // Check if the object with the provided objectId exists in the specified field
            const objectExists = candidate[field].some((item: any) => item._id.toString() === objectId);

            if (!objectExists) {
                console.error(`Object with ID ${objectId} not found in ${field} for candidate ${candidateId}`);
                return false; // Early return if the object is not found
            }

            // Proceed to remove the object
            const update = {
                $pull: { [field]: { _id: objectId } },
            };

            const updatedCandidate = await Candidate.findOneAndUpdate(
                { _id: candidateId },
                update,
                { session, new: true } // new: true returns the updated document
            );

            if (!updatedCandidate) {
                console.error(`Failed to update candidate with ID ${candidateId}`);
                throw new Error('Failed to update candidate');
            }

            // Commit transaction
            await session.commitTransaction();
            return true;
        } catch (error: any) {
            await handleTransactionError(session, "Error updating candidate professional profile:", error);
            return false;
        } finally {
            session.endSession();
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
const updateOrInsertArrayFieldById = (
    existingItems: any[],
    newItems: any[]
): void => {
    newItems.forEach((newItem) => {
        if (newItem._id) {
            // Find and update the existing item by _id
            const existingItemIndex = existingItems.findIndex((item) => item._id.toString() === newItem._id.toString());
            if (existingItemIndex !== -1) {
                existingItems[existingItemIndex] = newItem; // Update the existing item
            } else {
                existingItems.push(newItem); // If _id exists but not found, insert it
            }
        } else {
            // If no _id is provided, treat it as a new item and push it
            existingItems.push(newItem);
        }
    });
};

const updateLanguages = (candidate: ICandidate, languages: ILanguage[]): void => {
    updateOrInsertArrayFieldById(candidate.languages, languages);
};

const updateProjects = (candidate: ICandidate, projects: IProject[]): void => {
    updateOrInsertArrayFieldById(candidate.projects, projects);
};

const updateCertifications = (candidate: ICandidate, certifications: ICertification[]): void => {
    updateOrInsertArrayFieldById(candidate.certifications, certifications);
};

const updateEducations = (candidate: ICandidate, educations: IEducation[]): void => {
    updateOrInsertArrayFieldById(candidate.educations, educations);
};

const updateExperiences = (candidate: ICandidate, experiences: IExperience[]): void => {
    updateOrInsertArrayFieldById(candidate.experiences, experiences);
};

const updateProgrammingSkills = (candidate: ICandidate, programmingSkills: string): void => {
    candidate.programmingSkills = programmingSkills;
};


export default CandidateService;
