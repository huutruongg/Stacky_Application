import { ICandidate } from "../interfaces/ICandidate";
import CandidateRepository from "../repositories/CandidateRepository";
import { Types } from "mongoose";

export default class CandidateService {
    private candidateRepository: CandidateRepository;

    constructor(candidateRepository: CandidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    async findCandidateById(id: string): Promise<ICandidate | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Candidate ID format.");
        }
        return await this.candidateRepository.findById(id);
    }

    async getCandidateByUserId(userId: string): Promise<ICandidate | null> {
        if (!Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid User ID format.");
        }
        return await this.candidateRepository.findCandidateByUserId(userId);
    }

    async createCandidate(data: Partial<ICandidate>): Promise<ICandidate> {
        if (!data.userId || !data.fullName) {
            throw new Error("User ID and full name are required.");
        }
        return await this.candidateRepository.createCandidate(data);
    }

    async updateOauth(
        userId: string, 
        provider: string, 
        providerId: string, 
        accessToken: string
    ): Promise<ICandidate | null> {
        return await this.candidateRepository.updateOauth(userId, provider, providerId, accessToken);
    }

    async updateProfile(userId: string, data: Partial<ICandidate>): Promise<ICandidate | null> {
        return await this.candidateRepository.updateCandidate(userId, data);
    }

    async updateProfessionalInfo(userId: string, data: Partial<ICandidate>): Promise<boolean> {
        const bulkOps = this.prepareBulkOperations(userId, data);
        if (bulkOps.length > 0) {
            await this.candidateRepository.bulkUpdate(bulkOps);
        }
        return true;
    }

    async deleteCandidate(userId: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid User ID.");
        }
        return await this.candidateRepository.deleteCandidate(userId);
    }

    private prepareBulkOperations(userId: string, data: Partial<ICandidate>): any[] {
        const handleSubdocuments = (fieldName: string, subdocs: any[] | undefined) => {
            if (!subdocs) return [];
            return subdocs.map(subdoc => {
                if (subdoc._id) {
                    return {
                        updateOne: {
                            filter: { userId: new Types.ObjectId(userId), [`${fieldName}._id`]: subdoc._id },
                            update: { $set: { [`${fieldName}.$`]: subdoc } }
                        }
                    };
                } else {
                    return {
                        updateOne: {
                            filter: { userId: new Types.ObjectId(userId) },
                            update: { $push: { [fieldName]: subdoc } }
                        }
                    };
                }
            });
        };

        return [
            ...handleSubdocuments('languages', data.languages),
            ...handleSubdocuments('projects', data.projects),
            ...handleSubdocuments('educations', data.educations),
            ...handleSubdocuments('experiences', data.experiences),
            ...handleSubdocuments('certifications', data.certifications),
        ];
    }
}
