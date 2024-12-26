import { ObjectId, Types } from "mongoose";
import { RecruiterDTO } from "../dtos/RecruiterDTO";
import { IRecruiter } from "../interfaces/IRecruiter";
import RecruiterRepository from "../repositories/RecruiterRepository";
import { IImage } from "../interfaces/IImage";
import { log } from "console";
import { IPayment } from "../interfaces/IPayment";
import RecruiterListDTO from "../dtos/RecruiterListDTO";
import RecruiterModel from "../models/RecruiterModel";

export default class RecruiterService {
  private recruiterRepository: RecruiterRepository;

  constructor(recruiterRepository: RecruiterRepository) {
    this.recruiterRepository = recruiterRepository;
  }

  public getRecruiterById = async (id: string) => {
    return this.recruiterRepository.findById(id);
  };

  public getRecruiterByUserId = async (userId: string) => {
    try {
      const result = await RecruiterModel.aggregate([
        {
          $match: { userId: new Types.ObjectId(userId) } // Match the recruiter by userId
        },
        {
          $lookup: {
            from: 'users', // Collection name for the User schema
            localField: 'userId', // Field in RecruiterSchema
            foreignField: '_id', // Field in UserSchema
            as: 'userDetails' // Alias for the joined data
          }
        },
        {
          $unwind: '$userDetails' // Flatten the userDetails array
        },
        {
          $project: {
            _id: 1,
            orgEmail: 1,
            orgName: 1,
            orgField: 1,
            orgScale: 1,
            orgTaxNumber: 1,
            orgAddress: 1,
            orgWebsiteUrl: 1,
            orgFacebookLink: 1,
            orgLinkedinLink: 1,
            orgYoutubeLink: 1,
            orgIntroduction: 1,
            orgBenefits: 1,
            orgImage: 1,
            orgCoverImage: 1,
            orgImages: 1,
            phoneNumber: '$userDetails.phoneNumber' // Include phoneNumber from User schema
          }
        }
      ]);

      if (!result || result.length === 0) {
        throw new Error('Recruiter not found');
      }

      return result[0];
    } catch (error: any) {
      console.error('Error fetching recruiter details:', error.message);
      throw error;
    }
  };

  public getRecruiterByEmail = async (email: string) => {
    return this.recruiterRepository.findOne({ email });
  };

  public updateCompanyInfo = async (userId: string, recruiter: RecruiterDTO) => {
    const data = await this.recruiterRepository.findOne({ userId });
    if (!data) return null;

    const updatedRecruiter = await this.recruiterRepository.updateOne(userId, recruiter);
    return !!updatedRecruiter;
  };

  public updateCompanyAccount = async (userId: string, recruiter: any) => {
    const dataToUpdate = {
      orgName: recruiter.orgName,
      orgEmail: recruiter.orgEmail
    };
    const updatedRecruiter = await this.recruiterRepository.updateCompanyAccount(userId, dataToUpdate);
    return !!updatedRecruiter;
  };

  public deposit = async (userId: string, amount: number) => {
    const data = await this.recruiterRepository.findOne({ userId });
    if (!data) return null;

    const updatedRecruiter = await this.recruiterRepository.updateBalance(userId, amount);
    return !!updatedRecruiter;
  };

  public payFor = async (userId: string, amount: number) => {
    const data = await this.recruiterRepository.findOne({ userId });
    if (!data) return null;

    const updatedRecruiter = await this.recruiterRepository.updateBalance(userId, amount);
    return !!updatedRecruiter;
  };

  public addPayment = async (userId: string, payment: IPayment) => {
    const data = await this.recruiterRepository.findOne({ userId });
    if (!data) return null;

    const updatedRecruiter = await this.recruiterRepository.addPayment(userId, payment);
    return !!updatedRecruiter;
  };

  public getPaymentInfo = async (userId: string) => {
    const data = await this.recruiterRepository.getPaymentInfo(userId);
    if (!data) return null;

    log("data", data);
    const historyPayments = data.payments.filter((payment) => !payment.isDeposit);
    const historyDeposit = data.payments.filter((payment) => payment.isDeposit);
    return {
      orgName: data.orgName,
      balance: data.balance,
      historyPayments,
      historyDeposit
    };
  };

  public getListCompany = async () => {
    const companies = await this.recruiterRepository.getAllRecruiters();
    if (!companies) return null;

    return companies.map((company: IRecruiter) => new RecruiterListDTO(
      company.userId as ObjectId,
      company.orgName,
      company.orgImage,
      company.orgCoverImage,
      company.orgIntroduction,
    ));
  };

  public getListCompanyByPage = async (search: string, page: number, pageSize: number) => {
    const companies = await this.recruiterRepository.getAllRecruitersByPage(search, page, pageSize);
    if (!companies) return null;

    return companies.map((company: IRecruiter) => new RecruiterListDTO(
      company.userId as ObjectId,
      company.orgName,
      company.orgImage,
      company.orgCoverImage,
      company.orgIntroduction,
    ));
  };
}
