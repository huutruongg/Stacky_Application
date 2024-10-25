import { ObjectId, Types } from "mongoose";
import { RecruiterDTO } from "../dtos/RecruiterDTO";
import { IRecruiter } from "../interfaces/IRecruiter";
import RecruiterRepository from "../repositories/RecruiterRepository";
import { IImage } from "../interfaces/IImage";

export default class RecruiterService {
  private recruiterRepository: RecruiterRepository;

  constructor(recruiterRepository: RecruiterRepository) {
    this.recruiterRepository = recruiterRepository;
  }

  async toRecruiterDTO(recruiter: IRecruiter): Promise<RecruiterDTO> {
    const { _id ,orgEmail, orgName, orgField, orgScale, orgTaxNumber, orgAddress, orgImage, coverImage, images } = recruiter;
    return new RecruiterDTO(
            _id as ObjectId,
            orgEmail,
            orgName,
            orgField,
            orgScale,
            orgTaxNumber,
            orgAddress,
            orgImage,
            coverImage,
            images as IImage[]
        );
  }

  async getRecruiterById(id: string) {
    return this.recruiterRepository.findById(id);
  }

  async getRecruiterByUserId(userId: string) {
    const data : IRecruiter | null = await this.recruiterRepository.findOne({ userId });
    if (!data) {
      return null;
    }
    return this.toRecruiterDTO(data);
  }

  async getRecruiterByEmail(email: string) {
    return this.recruiterRepository.findOne({ email });
  }

  
}