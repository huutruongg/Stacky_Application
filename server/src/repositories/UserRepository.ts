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

    public findById = async (id: string): Promise<IUser | null> => {
        return this.model.findById(id).exec();
    }

    public findByEmail = async (privateEmail: string): Promise<IUser | null> => {
        log("privateEmail", privateEmail);
        const data = await this.model.findOne({ privateEmail }).lean().exec();
        log("data", data);
        return data;
    }
    
    public changePassword = async (id: string, password: string): Promise<IUser | null> => {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return this.model.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).exec();
    }

    public createUser = async (data: Partial<IUser>): Promise<IUser> => {
        log("data", data);
        if (data.password && (data.role === "ADMIN" || data.role === "RECRUITER")) {
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            return this.model.create({ ...data, password: hashedPassword });
        } else if (!data.password && data.role === "CANDIDATE") {
            return this.model.create(data);
        } else {
            throw new Error("Invalid data");
        }
    }

    public findOneAndUpdate = async (query: any, data: any): Promise<IUser | null> => {
        return this.model.findOneAndUpdate(query, data, { new: true }).exec();
    }

    public updateUser = async (userId: string, data: Partial<IUser>): Promise<IUser | null> => {
        return this.model.findByIdAndUpdate(userId, data, { new: true }).exec();
    }

    public isAdmin = async (userId: string): Promise<boolean> => {
        const user = await this.model.findOne({ _id: userId, role: 'ADMIN' }).lean();
        return !!user; 
    }

    public isRefreshTokenValid = async (refreshToken: string): Promise<boolean> => {
        const user = await this.model.findOne({ refreshToken }).lean();
        return !!user;
    }
}