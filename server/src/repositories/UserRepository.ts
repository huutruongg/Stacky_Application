import { log } from "console";
import { BaseRepository } from "./BaseRepository";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/IUser";
import UserModel from "../models/UserModel";
const saltRounds = 10;

export default class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }

    async findById(id: string): Promise<IUser | null> {
        return await this.model.findById(id).exec();
    }

    async findByEmail(privateEmail: string): Promise<IUser | null> {
        return await this.model.findOne({ privateEmail }).exec();
    }

    async findByRefreshToken(refreshToken: string): Promise<IUser | null> {
        return await this.model.findOne({ refreshToken }).exec();
    }

    async changePassword(id: string, password: string): Promise<IUser | null> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.model.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).exec();
    }

    async createUser(data: Partial<IUser>): Promise<IUser> {
        log("data", data);
        if (data.password && (data.role === "ADMIN" || data.role === "RECRUITER")) {
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            return await this.model.create({ ...data, password: hashedPassword });
        } else if (!data.password && data.role === "CANDIDATE") {
            return await this.model.create(data);
        } else {
            throw new Error("Invalid data");
        }
    }

    async findOneAndUpdate(query: any, data: any): Promise<IUser | null> {
        return await this.model.findOneAndUpdate({ query }, { data }, { new: true }).exec();
    }

    async updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
        return await this.model.findByIdAndUpdate(userId, data, { new: true }).exec();
    }

    async isAdmin(userId: string): Promise<boolean> {
        const user = await this.model.findOne({ _id: userId, role: 'ADMIN' }).lean();
        return !!user; 
    }
}