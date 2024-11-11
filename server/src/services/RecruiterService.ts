import { ObjectId, Types } from "mongoose";
import { RecruiterDTO } from "../dtos/RecruiterDTO";
import { IRecruiter } from "../interfaces/IRecruiter";
import RecruiterRepository from "../repositories/RecruiterRepository";
import { IImage } from "../interfaces/IImage";
import { log } from "console";
import { IPayment } from "../interfaces/IPayment";
import RecruiterListDTO from "../dtos/RecruiterListDTO";

export default class RecruiterService {
  private recruiterRepository: RecruiterRepository;

  constructor(recruiterRepository: RecruiterRepository) {
    this.recruiterRepository = recruiterRepository;
  }

  async getRecruiterById(id: string) {
    return this.recruiterRepository.findById(id);
  }

  async getRecruiterByUserId(userId: string) {
    const data: IRecruiter | null = await this.recruiterRepository.findOne({ userId });
    if (!data) {
      return null;
    }
    
    const recruiterDTO = new RecruiterDTO(
      data._id as ObjectId,
      data.orgEmail,
      data.orgName,
      data.orgField,
      data.orgScale,
      data.orgTaxNumber,
      data.orgAddress,
      data.orgWebsiteUrl,
      data.orgFacebookLink,
      data.orgLinkedinLink,
      data.orgYoutubeLink,
      data.orgIntroduction,
      data.orgBenefits,
      data.orgImage,
      data.orgCoverImage,
      data.orgImages as IImage[]
    );
    return recruiterDTO;
  }

  async getRecruiterByEmail(email: string) {
    return this.recruiterRepository.findOne({ email });
  }

  async updateCompanyInfo(userId: string, recruiter: RecruiterDTO) {
    const data = await this.recruiterRepository.findOne({ userId });
    if (!data) {
      return null;
    }
    recruiter.orgImages = recruiter.orgImages.map((url) => ({
      imageUrl: url,
      uploadedAt: new Date()
    } as unknown as IImage));

    const updatedRecruiter = await this.recruiterRepository.updateOne(userId, recruiter);
    return !!updatedRecruiter;
  }

  async updateCompanyAccount(userId: string, recruiter: any) {
    const dataToUpdate = {
      orgName: recruiter.orgName,
      orgEmail: recruiter.orgEmail
    }
    const updatedRecruiter = await this.recruiterRepository.updateCompanyAccount(userId, dataToUpdate);
    return !!updatedRecruiter;
  }

  async deposit(userId: string, amount: number) {
    const data = await this.recruiterRepository.findOne({ userId });
    if (!data) {
      return null;
    }
    const updatedRecruiter = await this.recruiterRepository.updateBalance(userId, amount);
    return !!updatedRecruiter;
  }

  async payFor(userId: string, amount: number) {
    const data = await this.recruiterRepository.findOne({ userId });
    if (!data) {
      return null;
    }
    const updatedRecruiter = await this.recruiterRepository.updateBalance(userId, amount);
    return !!updatedRecruiter;
  }

  async addPayment(userId: string, payment: IPayment) {
    const data = await this.recruiterRepository.findOne({ userId });
    if (!data) {
      return null;
    }
    const updatedRecruiter = await this.recruiterRepository.addPayment(userId, payment);
    return !!updatedRecruiter;

  }

  async getPaymentInfo(userId: string) {
    const data = await this.recruiterRepository.getPaymentInfo(userId);
    if (!data) {
      return null;
    }
    log("data", data);
    const historyPayments = data.payments.filter((payment) => !payment.isDeposit);
    const historyDeposit = data.payments.filter((payment) => payment.isDeposit);
    const resData = {
      balance: data.balance,
      historyPayments,
      historyDeposit
    }
    return resData;
  }

  async getListCompany() {
    const companies = await this.recruiterRepository.getAllRecruiters();
    if (!companies) {
      return null;
    }
    return companies.map((company : IRecruiter) => new RecruiterListDTO(
      company._id as ObjectId,
      company.orgName,
      company.orgImage,
      company.orgCoverImage,
      company.orgIntroduction,
    ));
  }

  async getListCompanyByPage(search: string, page: number, pageSize: number) {
    const companies = await this.recruiterRepository.getAllRecruitersByPage(search, page, pageSize);
    if (!companies) {
      return null;
    }
    return companies.map((company : IRecruiter) => new RecruiterListDTO(
      company._id as ObjectId,
      company.orgName,
      company.orgImage,
      company.orgCoverImage,
      company.orgIntroduction,
    ));
  }

  // async findCompany(search: string) {
  //   const companies = await this.recruiterRepository.findCompany(search);
  //   if (!companies) {
  //     return null;
  //   }
  //   return companies.map((company : IRecruiter) => new RecruiterListDTO(
  //     company._id as ObjectId,
  //     company.orgName,
  //     company.orgImage,
  //     company.orgCoverImage,
  //     company.orgIntroduction,
  //   ));
  // }
}