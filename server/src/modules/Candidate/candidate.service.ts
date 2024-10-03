import { ICertification, IEducation, IExperience, ILanguage, IProject } from './../../types/ICandidate.d';
import { log } from 'console';
import { ICandidate } from '../../types/ICandidate';
import { Candidate } from '../../models/candidate.model';
import { Application } from '../../models/application.model';
import { User } from '../../models/user.model';
import { IApplication } from '../../types/IApplication';


const CandidateService = {

    getCandidates: async (): Promise<ICandidate[] | null> => {
        try {
            const candidates = await Candidate.find().populate('userId').exec();
            return candidates.length > 0 ? candidates : null;
        } catch (error) {
            console.error("Error fetching candidates:", error);
            return null;
        }
    },

    getCandidateById: async (candidateId: string): Promise<ICandidate | null> => {
        try {
            return await Candidate.findById(candidateId).exec();
        } catch (error) {
            console.error("Error fetching candidate by userId:", error);
            return null;
        }
    },

    getCandidatesApplied: async (jobId: string): Promise<ICandidate[] | null> => {
        try {
            const applications = await Application.find({ jobId }).exec();

            if (!applications || applications.length === 0) {
                return null;
            }

            const userIds = applications.map((app: IApplication) => app.candidateId);
            // Tìm candidates dựa trên userId
            const candidates = await Candidate.find({ userId: { $in: userIds } }).populate('userId').exec();
            return candidates.length > 0 ? candidates : null;
        } catch (error) {
            console.error("Error fetching candidates who applied for the job:", error);
            return null;
        }
    },

    updateOauth: async (
        provider: string,
        providerId: string,
        accessToken: string,
        userId: string
    ): Promise<void> => {
        try {
            const candidate = await Candidate.findOne({ userId }).exec();
            log("Candidate: ", candidate)
            if (!candidate) {
                throw new Error("Candidate not found");
            }

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
            console.error("Error updating OAuth token:", error);
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
            const result = await Candidate.findByIdAndUpdate(
                candidateId,
                {
                    fullName,
                    jobPosition,
                    publicEmail,
                    phoneNumber,
                    gender,
                    avatar,
                    birthDate,
                    address,
                    linkedinUrl,
                    githubUrl,
                    personalDescription,
                },
                { new: true }
            );
            if (!result) {
                throw new Error("Failed to update candidate profile");
            }
            return true;
        } catch (error) {
            console.error("Error creating candidate personal profile:", error);
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
        const session = await Candidate.startSession();
        session.startTransaction();
        try {
            const candidate = await CandidateService.getCandidateById(candidateId);
            if (!candidate) {
                throw new Error("Candidate not found");
            }

            candidate.languages = languages;
            candidate.projects = projects;
            candidate.certifications = certifications;
            candidate.programmingSkills = programmingSkills;
            candidate.educations = educations;
            candidate.experiences = experiences;

            await candidate.save({ session });

            // Commit transaction
            await session.commitTransaction();
            session.endSession();

            return true;
        } catch (error) {
            console.error("Error creating candidate professional profile:", error);
            await session.abortTransaction();
            session.endSession();
            return false;
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
            console.error("Error fetching URLs shared by candidate:", error);
            return null;
        }
    },

    getAccessTokenGithub: async (id: string): Promise<string | null> => {
        try {
            const candidate = await Candidate.findOne({ _id: id })
                .select('oauthTokens')
                .exec();
            if (!candidate || !candidate.oauthTokens) {
                return null;
            }
            const githubToken = candidate.oauthTokens.find(token => token.provider === 'GITHUB');
            return githubToken ? githubToken.accessToken : null;
        } catch (error) {
            console.error("Error fetching GitHub access token:", error);
            return null;
        }
    }
};

export default CandidateService;
