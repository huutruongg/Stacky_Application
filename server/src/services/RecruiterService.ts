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

  public getRecruiterById = async (id: string) => {
    return this.recruiterRepository.findById(id);
  };

  public getRecruiterByUserId = async (userId: string) => {
    const data: IRecruiter | null = await this.recruiterRepository.findOne({ userId: new Types.ObjectId(userId) });
    if (!data) return null;

    return new RecruiterDTO(
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
      data.orgImages as string[]
    );
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
