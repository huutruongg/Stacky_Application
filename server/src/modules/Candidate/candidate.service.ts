import { ICertificate, IEducation, IExperience, ILanguage, IProject } from './../../types/ICandidate.d';
import { log } from 'console';
import { ICandidate } from '../../types/ICandidate';
import { Candidate } from '../../models/candidate.model';
import { Application } from '../../models/application.model';


const CandidateService = {

    getCandidates: async (): Promise<ICandidate[] | null> => {
        try {
            const candidates = await Candidate.find().exec();

            return candidates.length > 0 ? candidates : null;
        } catch (error) {
            console.error("Error fetching candidates:", error);
            return null;
        }
    },
    getCandidateById: async (id: string): Promise<ICandidate | null> => {
        try {
            return await Candidate.findById(id).exec();
        } catch (error) {
            log(error);
            return null;
        }
    },

    getCandidateByEmail: async (email: string): Promise<ICandidate | null> => {
        try {
            return await Candidate.findOne({ email }).exec();
        } catch (error) {
            log(error);
            return null;
        }
    },


    getCandidatesApplied: async (jobId: string): Promise<ICandidate[] | null> => {
        try {
            const applications = await Application.find({ jobId }).select('candidateId').exec();

            if (!applications || applications.length === 0) {
                return null;
            }
            const candidateIds = applications.map(app => app.candidateId);
            const candidates = await Candidate.find({ _id: { $in: candidateIds } }).exec();
            return candidates.length > 0 ? candidates : null;
        } catch (error) {
            console.error("Error fetching candidates who applied for the job:", error);
            return null;
        }
    },

    createCandidate: async (email: string, username: string): Promise<ICandidate | null> => {

        try {
            const candidate = await Candidate.create({
                email, username
            })
            return candidate;
        } catch (error) {
            log(error);
            return null;
        }
    },
    updateOauth: async (
        provider: string,
        providerId: string,
        accessToken: string,
        candidateId: string
    ): Promise<void> => {
        try {
            // Tìm ứng viên theo ID
            log("ID: ", candidateId)
            const candidate = await Candidate.findById(candidateId).exec();
            if (!candidate) {
                throw new Error("Candidate not found");
            }

            // Kiểm tra xem có OAuth token nào đã tồn tại với provider và providerId không
            const existingTokenIndex = candidate.oauthTokens.findIndex(
                token => token.provider === provider && token.providerId === providerId
            );

            if (existingTokenIndex !== -1) {
                // Nếu đã tồn tại, cập nhật accessToken
                candidate.oauthTokens[existingTokenIndex].accessToken = accessToken;
            } else {
                // Nếu chưa tồn tại, thêm mới token vào mảng oauthTokens
                candidate.oauthTokens.push({
                    provider,
                    providerId,
                    accessToken
                });
            }

            // Lưu lại candidate với token đã cập nhật
            await candidate.save();
        } catch (error) {
            console.error("Error updating OAuth token:", error);
            throw new Error("Failed to update OAuth token");
        }
    },

    createCandidatePersonalProfile: async (
        userId: string,
        fullName: string,
        gender: boolean,
        birthDate: Date,
        address: string,
        linkedinUrl: string,
        githubUrl: string,
        personalDescription: string,
        jobPosition: string
    ): Promise<boolean> => {
        try {
            // Cập nhật thông tin cá nhân của ứng viên trong MongoDB
            const result = await Candidate.findByIdAndUpdate(
                userId,
                {
                    fullName,
                    gender,
                    birthDate,
                    address,
                    linkedinUrl,
                    githubUrl,
                    personalDescription,
                    jobPosition,
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

    createCandidateProfessionalProfile: async (
        candidateId: string,
        languages: ILanguage[],
        projects: IProject[],
        certificates: ICertificate[],
        programmingSkills: string,
        educations: IEducation[],
        experiences: IExperience[]
    ): Promise<boolean> => {
        const session = await Candidate.startSession();
        session.startTransaction();
        try {
            // Tìm candidate cần cập nhật
            const candidate = await Candidate.findById(candidateId).session(session);

            if (!candidate) {
                throw new Error("Candidate not found");
            }

            // Cập nhật từng trường subdocument của Candidate
            candidate.languages = languages;
            candidate.projects = projects;
            candidate.certificates = certificates;
            candidate.programmingSkills = programmingSkills;
            candidate.educations = educations;
            candidate.experiences = experiences;

            // Lưu lại thông tin ứng viên đã được cập nhật
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

    submitProfessionalDetails: (
        userId: string,
        candidateId: string,
        fullName: string,
        gender: boolean,
        birthDate: Date,
        address: string,
        linkedinUrl: string,
        githubUrl: string,
        personalDescription: string,
        jobPosition: string,
        languages: ILanguage[],
        projects: IProject[],
        certificates: ICertificate[],
        programmingSkills: string,
        educations: IEducation[],
        experiences: IExperience[]
    ): boolean => {
        try {
            CandidateService.createCandidatePersonalProfile(userId, fullName, gender, birthDate, address, linkedinUrl, githubUrl, personalDescription, jobPosition);
            CandidateService.createCandidateProfessionalProfile(candidateId, languages, projects, certificates, programmingSkills, educations, experiences);
            return true;
        } catch (error) {
            log(error);
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
