import { IApplicant } from "../interfaces/ICandidate";
import ApplicantModel from "../models/ApplicantModel";
import { BaseRepository } from "./BaseRepository";

export default class ApplicantRepository extends BaseRepository<IApplicant> {  
    constructor() {
        super(ApplicantModel);
    }

    async findById(id: string): Promise<IApplicant | null> {
        return await this.model.findById(id);
    }

    async findApplicantByUserId(userId: string): Promise<IApplicant | null> {
        return await this.model.findOne({ userId: userId }).exec();
    }

    async createApplicant(data: Partial<IApplicant>): Promise<IApplicant> {
        return await this.model.create(data);
    }

    async deleteApplication(userId: string, jobPostId: string): Promise<IApplicant | null> {
        return await this.model.findOneAndDelete({ userId, jobPostId }).exec();
    }
}