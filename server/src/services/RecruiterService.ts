import RecruiterRepository from "../repositories/RecruiterRepository";

export default class RecruiterService {
  private recruiterRepository: RecruiterRepository;

  constructor(recruiterRepository: RecruiterRepository) {
    this.recruiterRepository = recruiterRepository;
  }

  async getRecruiterById(id: string) {
    return this.recruiterRepository.findById(id);
  }

  async getRecruiterByUserId(userId: string) {
    return this.recruiterRepository.findOne({ userId });
  }

  async getRecruiterByEmail(email: string) {
    return this.recruiterRepository.findOne({ email });
  }
}