import { ObjectId, Types } from "mongoose";
import { RecruiterDTO } from "../dtos/RecruiterDTO";
import { IRecruiter } from "../interfaces/IRecruiter";
import RecruiterRepository from "../repositories/RecruiterRepository";
import { IImage } from "../interfaces/IImage";
import { log } from "console";

export default class RecruiterService {
  private recruiterRepository: RecruiterRepository;

  constructor(recruiterRepository: RecruiterRepository) {
    this.recruiterRepository = recruiterRepository;
  }

  async toRecruiterDTO(recruiter: IRecruiter): Promise<RecruiterDTO> {
    const { _id, orgEmail, orgName, orgField, orgWebsiteUrl, orgFacebookLink, orgLinkedinLink, orgYoutubeLink, orgIntroduction, orgBenefits, orgScale, orgTaxNumber, orgAddress, orgImage, orgCoverImage, orgImages } = recruiter;
    return new RecruiterDTO(
      _id as ObjectId,
      orgEmail,
      orgName,
      orgField,
      orgScale,
      orgTaxNumber,
      orgAddress,
      orgWebsiteUrl,
      orgFacebookLink,
      orgLinkedinLink,
      orgYoutubeLink,
      orgIntroduction,
      orgBenefits,
      orgImage,
      orgCoverImage,
      orgImages as IImage[]
    );
  }

  async getRecruiterById(id: string) {
    return this.recruiterRepository.findById(id);
  }

  async getRecruiterByUserId(userId: string) {
    const data: IRecruiter | null = await this.recruiterRepository.findOne({ userId });
    if (!data) {
      return null;
    }
    return this.toRecruiterDTO(data);
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
}