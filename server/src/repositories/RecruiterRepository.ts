
import { log } from "console";
import { IOrganizationName, IRecruiter } from "../interfaces/IRecruiter";
import RecruiterModel from "../models/RecruiterModel";
import { BaseRepository } from "./BaseRepository";
import { ObjectId, Types } from "mongoose";
import { RecruiterDTO } from "../dtos/RecruiterDTO";

export default class RecruiterRepository extends BaseRepository<IRecruiter> {
    constructor() {
        super(RecruiterModel);
    }

    async findById(id: string): Promise<IRecruiter | null> {
        return await this.model.findById(id);
    }

    async findRecruiterByUserId(userId: string): Promise<IRecruiter | null> {
        return await this.model.findOne({ userId: new Types.ObjectId(userId) }).exec();
    }

    async createRecruiter(data: Partial<IRecruiter>): Promise<IRecruiter> {
        return await this.model.create(data);
    }

    async updateRecruiter(data: Partial<IRecruiter>): Promise<IRecruiter | null> {
        return await this.model.findOneAndUpdate({ userId: data.userId }, data).exec();
    }

    async updateOne(userId: string, data: RecruiterDTO): Promise<boolean | null> {
        const updatedRecruiter = await this.model.findOneAndUpdate({ userId: new Types.ObjectId(userId) }, data).exec();
        return updatedRecruiter ? true : false;
    }

    async deleteRecruiter(userId: string): Promise<IRecruiter | null> {
        return await this.model.findOneAndDelete({ userId }).exec();
    }

    async getAllOrganizations(): Promise<IOrganizationName[]> {
        return this.model.find().select("_id orgName userId").lean().exec();
    }

    async getAllOrganizationByRecruiters(recruiterIds: string[]): Promise<IOrganizationName[]> {
        const data = await this.model.find({
            userId: { $in: recruiterIds }
        }).select(' _id userId orgName').lean();

        const result = data.map((recruiter) => {
            return {
                _id: recruiter._id,
                orgName: recruiter.orgName,
                userId: recruiter.userId
            };
        });

        log("result", result);
        return result;
    }

    async getRecruiterByIds(ids: string[]): Promise<any[]> {
        try {
            const objectIds = ids.map((id) => new Types.ObjectId(id));
            log("ObjectIds:", objectIds);
    
            const data = await this.model.find({ 
                userId: { $in: objectIds } 
            }).lean().exec();
    
            log("Fetched Recruiters:", data);
            return data;
        } catch (error) {
            console.error("Error fetching recruiters:", error);
            throw new Error("Failed to retrieve recruiters");
        }
    }
}