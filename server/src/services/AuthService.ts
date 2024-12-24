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
    private userRepository: UserRepository;
    private candidateRepository: CandidateRepository;
    private recruiterRepository: RecruiterRepository;
    constructor() {
        this.userRepository = new UserRepository();
        this.candidateRepository = new CandidateRepository();
        this.recruiterRepository = new RecruiterRepository();
    }

    async login(privateEmail: string, password: string): Promise<IUser | null> {
        const user = await this.userRepository.findByEmail(privateEmail);
        log("USER: ", user);
        if (!user) {
            return null;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return null;
        }
        return user;
    }

    async adminSignUp(data: Partial<IUser>): Promise<IUser | null> {
        const hashedPassword = await bcrypt.hash(data.password as string, saltRounds);
        const userData = {
            privateEmail: data.privateEmail,
            password: hashedPassword,
            role: UserRoles.ADMIN
        }
        return await this.userRepository.create(userData);
    }

    async recruiterSignUp(data: Partial<IUser & IRecruiter>): Promise<IUser | null> {
        const hashedPassword = await bcrypt.hash(data.password as string, saltRounds);
        const userData = {
            privateEmail: data.privateEmail,
            password: hashedPassword,
            phoneNumber: data.phoneNumber,
            role: UserRoles.RECRUITER
        }
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
    }

    async handleUserOAuth(
        provider: string,
        privateEmail: string,
        fullName: string,
        accessToken: string
    ): Promise<IUser | null> {
        const existingUser = await this.userRepository.findByEmail(privateEmail);

        // If the user already exists, check their role
        if (existingUser) {
            if (existingUser.role !== UserRoles.CANDIDATE) {
                // If the user has a different role, reject the login and request a different account
                throw new Error('Email already exists with a different role. Please use a different account.');
            }

            // If the role is CANDIDATE, update OAuth details and return the user
            await this.candidateRepository.updateOauth(String(existingUser._id), provider, accessToken);
            return existingUser;
        }

        // If the email does not exist, create a new candidate user
        console.log('Creating new user...');
        const newUser = await this.userRepository.createUser({
            privateEmail,
            role: UserRoles.CANDIDATE // Set the role to CANDIDATE
        });

        log("newUser: ", newUser);

        // Create a candidate profile for the new user
        const candidate = await this.candidateRepository.createCandidate({
            userId: newUser._id,
            fullName
        });

        log("Candidate profile created: ", candidate);

        // Update OAuth details for the new user
        await this.candidateRepository.updateOauth(String(newUser._id), provider, accessToken);

        return newUser;
    }


    async findById(id: string): Promise<IUser | null> {
        return await this.userRepository.findById(id);
    }

    async generateAccessToken(userId: string, role: string): Promise<string> {
        try {
            const payload = { userId, role, jti: uuidv4() };
            const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
                expiresIn: process.env.JWT_ACCESS_EXPIRATION
            });
            return token;
        } catch (error) {
            log("Error generating access token:", error);
            throw new Error('Failed to generate access token');
        }
    }

    // Generate Refresh Token with error handling and logging
    async generateRefreshToken(userId: string, role: string): Promise<string> {
        try {
            const payload = { userId, role, jti: uuidv4() };
            const token = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION
            });
            return token;
        } catch (error) {
            log("Error generating refresh token:", error);
            throw new Error('Failed to generate refresh token');
        }
    }

    // Update Refresh Token in User Repository with error handling and logging
    async updateRefreshToken(id: string, refreshToken: string): Promise<IUser | null> {
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
    }

    async forgotPassword(privateEmail: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(privateEmail);
        if (!user) {
            return false;
        }
        const url = `${process.env.URL_CLIENT}/recruiter/forgot-password/${user._id}`;
        log("URL: ", url);
        const htmlContent = resetPasswordTemplate(url);
        const result = await EmailService.sendEmail(
            privateEmail,
            "Reset your password!",
            "",
            htmlContent
        );
        return result
    }

    async resetPassword(userId: string, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await this.userRepository.findOneAndUpdate(userId, { password: hashedPassword });
    }

    async changePassword(userId: string, newPassword: string): Promise<boolean> {
        const user = await this.userRepository.findById(userId);
        log("USER: ", user);
        if (!user) {
            return false;
        }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const result = await this.userRepository.updateUser(userId, { password: hashedPassword });
        log("RESULT: ", result);
        return result !== null;
    }

    async isRefreshTokenValid(refreshToken: string): Promise<boolean> {
        try {
            const isValid = await this.userRepository.isRefreshTokenValid(refreshToken);
            return isValid!!;
        } catch (error) {
            return false;
        }
    }
}

// const a = new AuthService();

// a.adminSignUp({ privateEmail: 'admin', password: '123456' });