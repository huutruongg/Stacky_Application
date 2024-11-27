import CandidateRepository from "../repositories/CandidateRepository";
import JobPostRepository from "../repositories/JobPostRepository";
import RecruiterRepository from "../repositories/RecruiterRepository";

export default class AdminService {
    private candidateRepository: CandidateRepository;
    private recruiterRepository: RecruiterRepository;
    private jobPostRepository: JobPostRepository;
    constructor(candidateRepository: CandidateRepository, recruiterRepository: RecruiterRepository, jobPostRepository: JobPostRepository) {
        this.candidateRepository = candidateRepository;
        this.recruiterRepository = recruiterRepository;
        this.jobPostRepository = jobPostRepository;
        
    }
    
    public async getAllCandidates() {
        const candidates = await this.candidateRepository.findAll_a();
        return candidates;
    }

    public async getAllRecruiters() {
        const recruiters = await this.recruiterRepository.findAll_a();
        return recruiters;
    }

    public async getAllJobs() {
        const jobs = await this.jobPostRepository.findAll_a();
        return jobs;
    }

    public async getDetailCompany(recruiterId: string) {
        const company = await this.recruiterRepository.findOne_a(recruiterId);
        return company;
    }

    public async countJobsByMonth() {
        const jobs = await this.jobPostRepository.stacticsJobsfor12Months();
        return jobs;
    }

    public async getTotalCards() {
        const totalCards = {
            totalJobs: await this.jobPostRepository.count_a(),
            totalCandidates: await this.candidateRepository.count_a(),
            totalCompanies: await this.recruiterRepository.count_a(),
        }
        return totalCards;
    }
}