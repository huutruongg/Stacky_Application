import { log } from 'console';
import bcrypt from 'bcryptjs';
import UserRepository from "../repositories/UserRepository";
import jwt from 'jsonwebtoken';
import CandidateRepository from '../repositories/CandidateRepository';
import { UserRoles } from '../utils/roles';
import RecruiterRepository from '../repositories/RecruiterRepository';
import dotenv from 'dotenv';
import { IUser } from '../interfaces/IUser';
import { IRecruiter } from '../interfaces/IRecruiter';
import { resetPasswordTemplate } from '../views/resetPasswordTemplate';
import EmailService from './EmailService';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const saltRounds = 10;

export default class AuthService {
    private userRepository = new UserRepository();
    private candidateRepository = new CandidateRepository();
    private recruiterRepository = new RecruiterRepository();

    public login = async (privateEmail: string, password: string): Promise<IUser | null> => {
        const user = await this.userRepository.findByEmail(privateEmail);
        log("USER: ", user);
        if (!user) return null;

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        return isPasswordMatch ? user : null;
    };

    public adminSignUp = async (data: Partial<IUser>): Promise<IUser | null> => {
        const hashedPassword = await bcrypt.hash(data.password as string, saltRounds);
        const userData = {
            privateEmail: data.privateEmail,
            password: hashedPassword,
            role: UserRoles.ADMIN
        };
        return await this.userRepository.create(userData);
    };

    public recruiterSignUp = async (data: Partial<IUser & IRecruiter>): Promise<IUser | null> => {
        const hashedPassword = await bcrypt.hash(data.password as string, saltRounds);
        const userData = {
            privateEmail: data.privateEmail,
            password: hashedPassword,
            phoneNumber: data.phoneNumber,
            role: UserRoles.RECRUITER
        };
        const user = await this.userRepository.create(userData);
        const recruiterData = {
            userId: user._id,
            orgTaxNumber: data.orgTaxNumber,
            orgName: data.orgName,
            orgField: data.orgField,
            orgScale: data.orgScale,
            orgAddress: data.orgAddress
        };
        await this.recruiterRepository.createRecruiter(recruiterData);
        return user;
    };

    public handleUserOAuth = async (
        provider: string,
        privateEmail: string,
        fullName: string,
        accessToken: string
    ): Promise<IUser | null> => {
        const existingUser = await this.userRepository.findByEmail(privateEmail);

        if (existingUser) {
            if (existingUser.role !== UserRoles.CANDIDATE) {
                throw new Error('Email already exists with a different role. Please use a different account.');
            }
            await this.candidateRepository.updateOauth(String(existingUser._id), provider, accessToken);
            return existingUser;
        }

        log('Creating new user...');
        const newUser = await this.userRepository.createUser({
            privateEmail,
            role: UserRoles.CANDIDATE
        });

        log("newUser: ", newUser);

        const candidate = await this.candidateRepository.createCandidate({
            userId: newUser._id,
            fullName
        });

        log("Candidate profile created: ", candidate);

        await this.candidateRepository.updateOauth(String(newUser._id), provider, accessToken);

        return newUser;
    };

    public findById = async (id: string): Promise<IUser | null> => {
        return await this.userRepository.findById(id);
    };

    public generateAccessToken = async (userId: string, role: string): Promise<string> => {
        try {
            const payload = { userId, role, jti: uuidv4() };
            return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
                expiresIn: process.env.JWT_ACCESS_EXPIRATION
            });
        } catch (error) {
            log("Error generating access token:", error);
            throw new Error('Failed to generate access token');
        }
    };

    public generateRefreshToken = async (userId: string, role: string): Promise<string> => {
        try {
            const payload = { userId, role, jti: uuidv4() };
            return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION
            });
        } catch (error) {
            log("Error generating refresh token:", error);
            throw new Error('Failed to generate refresh token');
        }
    };

    public updateRefreshToken = async (id: string, refreshToken: string): Promise<IUser | null> => {
        try {
            const updatedUser = await this.userRepository.findOneAndUpdate(id, { refreshToken });
            if (!updatedUser) {
                log(`User with ID ${id} not found`);
                throw new Error('User not found');
            }
            log("Refresh token updated successfully for user", id);
            return updatedUser;
        } catch (error) {
            log("Error updating refresh token:", error);
            throw new Error('Failed to update refresh token');
        }
    };

    public forgotPassword = async (privateEmail: string): Promise<boolean> => {
        const user = await this.userRepository.findByEmail(privateEmail);
        if (!user) return false;

        const url = `${process.env.URL_CLIENT}/recruiter/forgot-password/${user._id}`;
        log("URL: ", url);
        const htmlContent = resetPasswordTemplate(url);
        return await EmailService.sendEmail(privateEmail, "Reset your password!", "", htmlContent);
    };

    public resetPassword = async (userId: string, password: string): Promise<void> => {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await this.userRepository.findOneAndUpdate(userId, { password: hashedPassword });
    };

    public changePassword = async (userId: string, newPassword: string): Promise<boolean> => {
        const user = await this.userRepository.findById(userId);
        log("USER: ", user);
        if (!user) return false;

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const result = await this.userRepository.updateUser(userId, { password: hashedPassword });
        log("RESULT: ", result);
        return result !== null;
    };

    public isRefreshTokenValid = async (refreshToken: string): Promise<boolean> => {
        try {
            return await this.userRepository.isRefreshTokenValid(refreshToken) ?? false;
        } catch (error) {
            return false;
        }
    };
}
