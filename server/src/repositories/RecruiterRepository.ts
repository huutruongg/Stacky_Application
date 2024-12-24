import { log } from "console";
import { IOrganizationName, IRecruiter } from "../interfaces/IRecruiter";
import RecruiterModel from "../models/RecruiterModel";
import { BaseRepository } from "./BaseRepository";
import { Types } from "mongoose";
import { RecruiterDTO } from "../dtos/RecruiterDTO";
import { PaymentInfo } from "../interfaces/IPayment";

export default class RecruiterRepository extends BaseRepository<IRecruiter> {
    constructor() {
        super(RecruiterModel);
    }

    public findById = async (id: string): Promise<IRecruiter | null> => {
        return await this.model.findById(id);
    };

    public findRecruiterByUserId = async (userId: string): Promise<IRecruiter | null> => {
        return await this.model.findOne({ userId: new Types.ObjectId(userId) }).exec();
    };

    public getAllRecruiters = async (): Promise<IRecruiter[] | null> => {
        return await this.model.find().lean().exec() as IRecruiter[];
    };

    public getAllRecruitersByPage = async (search: string, page: number, pageSize: number): Promise<IRecruiter[]> => {
        return await this.model.find({ orgName: { $regex: search, $options: 'i' } })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean()
            .exec() as IRecruiter[];
    };

    public createRecruiter = async (data: Partial<IRecruiter>): Promise<IRecruiter> => {
        return await this.model.create(data);
    };

    public updateRecruiter = async (data: Partial<IRecruiter>): Promise<IRecruiter | null> => {
        return await this.model.findOneAndUpdate({ userId: data.userId }, data).exec();
    };

    public updateCompanyAccount = async (userId: string, data: any): Promise<IRecruiter | null> => {
        return await this.model.findOneAndUpdate({ userId: new Types.ObjectId(userId) }, data).exec();
    };

    public updateOne = async (userId: string, data: RecruiterDTO): Promise<boolean | null> => {
        const updatedRecruiter = await this.model.findOneAndUpdate({ userId: new Types.ObjectId(userId) }, data).exec();
        return updatedRecruiter ? true : false;
    };

    public deleteRecruiter = async (userId: string): Promise<IRecruiter | null> => {
        return await this.model.findOneAndDelete({ userId }).exec();
    };

    public getAllOrganizations = async (): Promise<IOrganizationName[]> => {
        return this.model.find().select("_id orgName userId").lean().exec();
    };

    public getAllOrganizationByRecruiters = async (recruiterIds: string[]): Promise<IOrganizationName[]> => {
        const data = await this.model.find({
            userId: { $in: recruiterIds }
        }).select(' _id userId orgName').lean();

        const result = data.map((recruiter) => ({
            _id: recruiter._id,
            orgName: recruiter.orgName,
            userId: recruiter.userId
        }));

        log("result", result);
        return result;
    };

    public getRecruiterByIds = async (ids: string[]): Promise<any[]> => {
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
    };

    public updateBalance = async (userId: string, amount: number): Promise<boolean> => {
        try {
            const recruiter = await this.model.findOne({ userId }).exec();
            if (!recruiter) {
                console.error('User not found');
                return false;
            }

            log("Recruiter balance", recruiter.balance);
            let currentBalance = parseFloat(recruiter.balance);
            log("currentBalance", currentBalance);

            if (isNaN(currentBalance)) {
                console.error('Invalid current balance value:', recruiter.balance);
                return false;
            }

            const newBalance = currentBalance + amount;
            log("newBalance", newBalance);

            recruiter.balance = newBalance as unknown as string;

            const updatedRecruiter = await recruiter.save();
            if (!updatedRecruiter) {
                console.error('Failed to save updated recruiter');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error updating balance:', error);
            return false;
        }
    };

    public addPayment = async (userId: string, payment: any): Promise<boolean> => {
        try {
            const updatedRecruiter = await this.model.findOneAndUpdate(
                { userId },
                { $push: { payments: payment } },
                { new: true }
            ).exec();

            return !!updatedRecruiter;
        } catch (error) {
            console.error('Error adding payment:', error);
            return false;
        }
    };

    public getPaymentInfo = async (userId: string): Promise<PaymentInfo | null> => {
        const data = await this.model.findOne({ userId }).select('orgName balance payments').exec();
        if (!data) {
            return null;
        }
        log("Balance data", data.balance);
        return {
            orgName: data.orgName,
            balance: Number(data.balance),
            payments: data.payments
        };
    };
}
