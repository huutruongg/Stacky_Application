
import { log } from "console";
import { IOrganizationName, IRecruiter } from "../interfaces/IRecruiter";
import RecruiterModel from "../models/RecruiterModel";
import { BaseRepository } from "./BaseRepository";
import { ObjectId, Types } from "mongoose";
import { RecruiterDTO } from "../dtos/RecruiterDTO";
import { IPayment, PaymentInfo } from "../interfaces/IPayment";
import { decrypt, encrypt } from "../utils/encryption";

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

    async getAllRecruiters(): Promise<IRecruiter[] | null> {
        return await this.model.find().lean().exec() as IRecruiter[];
    }

    async getAllRecruitersByPage(search: string, page: number, pageSize: number): Promise<IRecruiter[]> {
        return await this.model.find({ orgName: { $regex: search, $options: 'i' } }).skip((page - 1) * pageSize).limit(pageSize).lean().exec() as IRecruiter[];
    }

    async createRecruiter(data: Partial<IRecruiter>): Promise<IRecruiter> {
        return await this.model.create(data);
    }

    async updateRecruiter(data: Partial<IRecruiter>): Promise<IRecruiter | null> {
        return await this.model.findOneAndUpdate({ userId: data.userId }, data).exec();
    }

    async updateCompanyAccount(userId: string, data: any): Promise<IRecruiter | null> {
        return await this.model.findOneAndUpdate({ userId: new Types.ObjectId(userId) }, data).exec();
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

    async updateBalance(userId: string, amount: number): Promise<boolean> {
        try {
            // Tìm tài liệu Recruiter từ DB
            const recruiter = await this.model.findOne({ userId }).exec();
            if (!recruiter) {
                console.error('User not found');
                return false;
            }
    
            log("Recruiter balance", recruiter.balance);
            // Giải mã và chuyển đổi số dư hiện tại thành kiểu number
            let currentBalance = parseFloat(recruiter.balance);
            log("currentBalance", currentBalance);
            // Kiểm tra tính hợp lệ của currentBalance
            if (isNaN(currentBalance)) {
                console.error('Invalid current balance value:', recruiter.balance);
                return false;
            }
    
            // Cộng thêm số tiền mới
            const newBalance = currentBalance + amount;
            log("newBalance", newBalance);
    
            // Mã hóa lại giá trị mới
            recruiter.balance = newBalance as unknown as string;
    
            // Lưu lại tài liệu đã cập nhật
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
    }
    
    async addPayment(userId: string, payment: any): Promise<boolean> {
        try {
            // Tìm và cập nhật số dư, đồng thời thêm mục thanh toán mới
            const updatedRecruiter = await this.model.findOneAndUpdate(
                { userId },
                {
                    $push: { payments: payment }
                },
                { new: true } // Trả về tài liệu đã cập nhật
            ).exec();

            return !!updatedRecruiter;
        } catch (error) {
            console.error('Error adding payment:', error);
            return false;
        }
    }

    async getPaymentInfo(userId: string): Promise<PaymentInfo | null> {
        const data = await this.model.findOne({ userId }).select('balance payments').exec();
        if (!data) {
            return null;
        }
        log("Balance data", data.balance);
        return {
            balance: Number(data.balance),
            payments: data.payments
        };
    }

//     async findCompany(search: string): Promise<IRecruiter[] | null> {
//         return await this.model.find({ orgName: { $regex: search, $options: 'i' } }).lean().exec() as IRecruiter[];
//     }
}
