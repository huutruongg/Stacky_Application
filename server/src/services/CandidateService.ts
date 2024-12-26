import { log } from "console";
import { ICandidate, IProfile } from "../interfaces/ICandidate";
import CandidateRepository from "../repositories/CandidateRepository";
import { Types } from "mongoose";
import CandidateModel from "../models/CandidateModel";

export default class CandidateService {
    private candidateRepository: CandidateRepository;

    constructor(candidateRepository: CandidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public findCandidateById = async (id: string): Promise<ICandidate | null> => {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Candidate ID format.");
        }
        return await this.candidateRepository.findById(id);
    };

    public getCandidateByUserId = async (userId: string): Promise<ICandidate | null> => {
        if (!Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid User ID format.");
        }
        return await this.candidateRepository.findCandidateByUserId(userId);
    };

    public getAppliedJobs = async (userId: string): Promise<any[] | null> => {
        const candidate = await CandidateModel.findOne({ userId: new Types.ObjectId(userId) }).populate({
            path: 'jobApplied.jobPostId',
            model: 'JobPost',
            select: 'jobImage orgName jobTitle location'
        });
        log("Candidate:", candidate);

        if (!candidate || !candidate.jobApplied || candidate.jobApplied.length === 0) {
            return [];
        }

        const appliedJobs = candidate.jobApplied.map(application => {
            const jobPost = application.jobPostId as {
                jobImage: string;
                orgName: string;
                jobTitle: string;
                location: string;
            };
            if (!jobPost) return null;

            return {
                orgImage: jobPost.jobImage || null,
                orgName: jobPost.orgName,
                jobTitle: jobPost.jobTitle,
                location: jobPost.location,
                appliedAt: application.appliedAt,
                status: application.status
            };
        }).filter(job => job !== null);

        return appliedJobs;
    };

    public createCandidate = async (data: Partial<ICandidate>): Promise<ICandidate> => {
        if (!data.userId || !data.fullName) {
            throw new Error("User ID and full name are required.");
        }
        return await this.candidateRepository.createCandidate(data);
    };

    public updateOauth = async (userId: string, provider: string, accessToken: string): Promise<ICandidate | null> => {
        return await this.candidateRepository.updateOauth(userId, provider, accessToken);
    };

    public updateProfile = async (userId: string, data: Partial<ICandidate>): Promise<ICandidate | null> => {
        const dataToUpdate = {
            fullName: data.fullName,
            jobPosition: data.jobPosition,
            publicEmail: data.publicEmail,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            birthDate: data.birthDate,
            avatarUrl: data.avatarUrl,
            address: data.address,
            linkedinUrl: data.linkedinUrl,
            githubUrl: data.githubUrl,
            personalDescription: data.personalDescription,
            professionalSkills: data.professionalSkills
        };
        return await this.candidateRepository.updateCandidate(userId, dataToUpdate);
    };

    public updateProfessionalInfo = async (userId: string, data: Partial<ICandidate>): Promise<boolean> => {
        const bulkOps = await this.prepareBulkOperations(userId, data);
        if (bulkOps.length > 0) {
            await this.candidateRepository.bulkUpdate(bulkOps);
        }
        return true;
    };

    public deleteCandidate = async (userId: string): Promise<boolean> => {
        if (!Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid User ID.");
        }
        return await this.candidateRepository.deleteCandidate(userId);
    };

    private prepareBulkOperations = async (userId: string, data: Partial<ICandidate>): Promise<any[]> => {
        const bulkOps: any[] = [];

        const replaceField = (fieldName: string, items: any[] | undefined) => {
            if (items) {
                bulkOps.push({
                    updateOne: {
                        filter: { userId: new Types.ObjectId(userId) },
                        update: { $set: { [fieldName]: items } }
                    }
                });
            }
        };

        replaceField('languages', data.languages);
        replaceField('projects', data.projects);
        replaceField('educations', data.educations);
        replaceField('experiences', data.experiences);
        replaceField('certifications', data.certifications);

        return bulkOps;
    };

    public updateCandidateProfile = async (userId: string, data: Partial<IProfile>): Promise<boolean | null> => {
        try {
            const candidateUpdate = {
                fullName: data.fullName,
                avatarUrl: data.avatarUrl,
                publicEmail: data.publicEmail
            };
            const candidate = await this.candidateRepository.updateAccountProfile(userId, candidateUpdate);
            return candidate !== null;
        } catch (error) {
            console.error("Error updating account profile:", error);
            return null;
        }
    };
}
