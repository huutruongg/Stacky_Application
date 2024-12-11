import JobPostRepository from "../repositories/JobPostRepository";
import { Types } from "mongoose";
import CandidateRepository from "../repositories/CandidateRepository";
import RecruiterRepository from "../repositories/RecruiterRepository";
import { ApplyStatus } from "../enums/EApplySatus";
import { UserRoles } from "../utils/roles";
import { JobPostDTO } from "../dtos/JobPostDTO";
import { IAIResult, IApplicant } from "../interfaces/ICandidate";
import { log } from "console";
import { IUserDataType } from "../interfaces/IUserData";
import { JobAppliedDTO } from "../dtos/JobAppliedDTO";
import { IJobPost } from "../interfaces/IJobPost";
import ApplicantRepository from '../repositories/ApplicantRepository';

export default class JobPostService {


    private jobPostRepository: JobPostRepository;
    private candidateRepository: CandidateRepository;
    private recruiterRepository: RecruiterRepository;
    private applicantRepository: ApplicantRepository;
    constructor(jobPostRepository: JobPostRepository, candidateRepository: CandidateRepository, recruiterRepository: RecruiterRepository, applicantRepository: ApplicantRepository) {
        this.jobPostRepository = jobPostRepository;
        this.candidateRepository = candidateRepository;
        this.recruiterRepository = recruiterRepository;
        this.applicantRepository = applicantRepository;
    }

    private toJobPostDTO(job: IJobPost): JobPostDTO {
        const { _id, jobTitle, orgName, jobImage, location, jobSalary, applicationDeadline, userId } = job;
        return new JobPostDTO(
            new Types.ObjectId(_id as string),
            jobTitle,
            jobImage,
            orgName,
            jobSalary,
            location,
            applicationDeadline,
            String(userId)
        );
    }

    private toJobAppliedDTO(job: IJobPost & Partial<{ status: ApplyStatus }>): JobAppliedDTO {
        const { _id, jobTitle, orgName, jobImage, location, status = ApplyStatus.PENDING, applicationDeadline, userId } = job;
        return new JobAppliedDTO(
            new Types.ObjectId(_id as string),
            jobTitle,
            jobImage,
            orgName,
            status,
            location,
            applicationDeadline,
            String(userId)
        );
    }

    async findByJobPostId(jobPostId: string): Promise<IJobPost | null> {
        if (!Types.ObjectId.isValid(jobPostId)) {
            throw new Error("Invalid job post ID format.");
        }
        return await this.jobPostRepository.findById(jobPostId);
    }

    async createJobPost(userId: string, data: any): Promise<IJobPost | null> {
        try {
            log("userId", userId);
            const recruiter = await this.recruiterRepository.findRecruiterByUserId(userId);
            log("Has recruiter: ", recruiter);
            if (!recruiter) {
                console.warn(`Recruiter with ID ${userId} not found.`);
                return null;
            }
            const createdJobPost = await this.jobPostRepository.createJobPost(recruiter.orgName, {...data, userId: userId} as IJobPost);
            log("Job posting created successfully");
            return createdJobPost;
        } catch (error) {
            console.error('Error creating job post:', error);
            return null;
        }
    }

    async updateJobPost(id: string, data: Partial<IJobPost>): Promise<IJobPost | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error("Invalid job post ID.");
        }

        const updatedJobPost = await this.jobPostRepository.updateJobPost(id, data);
        if (!updatedJobPost) {
            throw new Error("Job post not found or update failed.");
        }

        return updatedJobPost;
    }

    async deleteJobPost(user: IUserDataType, jobPostId: string): Promise<boolean | null> {
        if (!Types.ObjectId.isValid(jobPostId)) {
            throw new Error("Invalid job post ID.");
        }

        const isOwner = await this.jobPostRepository.isJobOwner(user.userId, jobPostId);
        let deletedJobPost: boolean | null = null;
        if (isOwner || user.role === UserRoles.ADMIN) {
            deletedJobPost = await this.jobPostRepository.deleteJobPost(jobPostId);
        }
        if (!deletedJobPost) {
            throw new Error("Job post not found.");
        }
        return deletedJobPost;
    }

    async getJobPostsByUserId(userId: string): Promise<any[]> {
        try {
            // Fetch job posts, recruiters, and candidate data in parallel
            const [jobPosts, savedJobIds] = await Promise.all([
                this.jobPostRepository.findAllMinData(),
                this.candidateRepository.getJobIdsSaved(new Types.ObjectId(userId)),
            ]);

            if (!jobPosts || !savedJobIds) {
                console.warn("No job posts found");
                return [];
            }
            // Map through job posts and attach orgName and isLiked flag
            const jobsWithDetails = jobPosts.map((job) => {
                // Handle cases where job.userId or recruiter.userId might be undefined

                return {
                    ...job,
                    isLiked: savedJobIds.includes(String(job._id)),
                };
            });
            return jobsWithDetails;
        } catch (error) {
            console.error("Error fetching job postings:", error);
            return [];
        }
    }

    async getAllJobPosts(): Promise<JobPostDTO[]> {
        const jobPosts = await this.jobPostRepository.getAllJobPosts();
        return jobPosts.map((job) => this.toJobPostDTO(job));
    }

    async getJobPostsByPage(page: number, pageSize: number): Promise<JobPostDTO[]> {
        const jobPosts = await this.jobPostRepository.getJobPostsByPage(page, pageSize);
        return jobPosts.map((job) => this.toJobPostDTO(job));
    }

    async isSavedJobPost(userId: string, jobPostId: string): Promise<boolean> {
        try {
            const candidate = await this.candidateRepository.findCandidateByUserId(userId);
            if (!candidate) {
                console.warn(`Candidate with ID ${userId} not found.`);
                return false;
            }

            const isExisting = await this.candidateRepository.checkExistingUserInJobSaved(userId, jobPostId);
            return !!isExisting;
        } catch (error) {
            console.error("Error checking saved job post:", error);
            return false;
        }
    }

    async getSavedJobs(userId: string): Promise<JobPostDTO[] | null> {
        try {
            const savedJobIds = await this.candidateRepository.getJobIdsSaved(new Types.ObjectId(userId));
            if (!savedJobIds || savedJobIds.length === 0) {
                console.warn(`No saved jobs found for user: ${userId}`);
                return [];
            }
            // log("savedJobIds", savedJobIds);
            const jobPosts = await this.jobPostRepository.getJobPostByIds(savedJobIds as string[]);
            if (!jobPosts || jobPosts.length === 0) {
                console.warn(`No job posts found for saved jobs: ${savedJobIds}`);
                return [];
            }
            // log(jobPosts.map((job) => this.toJobPostDTO(job)))
            return jobPosts.map((job) => this.toJobPostDTO(job));
        } catch (error) {
            console.error('Error fetching job posts with orgName:', error);
            throw new Error('Could not fetch job posts');
        }
    }

    async getJobApplied(userId: string): Promise<JobAppliedDTO[] | null> {
        try {
            const jobApplications = await this.candidateRepository.findAppliedJobs(userId);

            log("jobApplications", jobApplications);

            if (!jobApplications || jobApplications.length === 0) {
                console.warn(`Candidate with ID ${userId} not found or has no applied jobs.`);
                return [];
            }
            const jobPostIds = jobApplications.map(application => String(application.jobPostId));
            const jobsApplied = await this.jobPostRepository.getJobPostByIds(jobPostIds);

            if (!jobsApplied || jobsApplied.length === 0) {
                console.warn(`No job posts found for applied job IDs: ${jobPostIds}`);
                return [];
            }
            return jobsApplied.map((job) => this.toJobAppliedDTO(job));
        } catch (error) {
            console.error('Error fetching job posts with orgName:', error);
            throw new Error('Could not fetch job posts');
        }
    }

    async findByCondition(queryParams: { [key: string]: string }): Promise<JobPostDTO[]> {
        try {
            const query: any = {};
            if (queryParams.jobTitle) {
                query.jobTitle = { $regex: queryParams.jobTitle, $options: 'i' };
            }
            if (queryParams.location) {
                query.location = { $regex: queryParams.location, $options: 'i' };
            }
            if (queryParams.industry) {
                query.typeOfIndustry = { $regex: queryParams.industry, $options: 'i' };
            }
            if (queryParams.yearsOfExperience) {
                query.yearsOfExperience = { $regex: queryParams.yearsOfExperience, $options: 'i' };
            }

            log("Query: ", query);

            // Find job posts by condition
            const jobPosts = await this.jobPostRepository.findAllByCondition(query);
            // Convert to DTO
            return jobPosts.map((job) => this.toJobPostDTO(job));
        } catch (error) {
            console.error('Error finding jobs by condition:', error);
            throw new Error('Could not find job posts by condition');
        }
    }


    async createApplication(userId: string, jobPostId: string): Promise<boolean> {
        try {
            // Kiểm tra nếu ứng viên đã ứng tuyển trước đó
            const hasApplied = await this.candidateRepository.hasApplied(userId, jobPostId);
            if (hasApplied) {
                console.warn(`Candidate ${userId} has already applied for job ${jobPostId}`);
                return false;
            }

            // Lấy thông tin người dùng
            const user = await this.candidateRepository.findCandidateByUserId(userId);
            log("User: ", user);
            if (!user) {
                console.warn(`User with ID ${userId} not found.`);
                return false;
            }

            // Lấy thông tin ứng viên
            const candidate = await this.candidateRepository.findByUserId(userId);
            if (!candidate || candidate.languages?.length === 0 || candidate.projects?.length === 0 || candidate.educations?.length === 0 || candidate.certifications?.length === 0) {
                console.warn(`Candidate with ID ${userId} not found.`);
                return false;
            }

            const newApplicant = {
                jobPostId: jobPostId,
                userId: candidate.userId,
                professionalSkills: candidate.professionalSkills,
                fullName: candidate.fullName,
                jobPosition: candidate.jobPosition,
                publicEmail: candidate.publicEmail,
                avatarUrl: candidate.avatarUrl,
                phoneNumber: candidate.phoneNumber,
                address: candidate.address,
                birthDate: candidate.birthDate,
                linkedinUrl: candidate.linkedinUrl,
                githubUrl: candidate.githubUrl,
                personalDescription: candidate.personalDescription,
                languages: candidate.languages || [],
                projects: candidate.projects || [],
                educations: candidate.educations || [],
                experiences: candidate.experiences || [],
                certifications: candidate.certifications || [],
                status: ApplyStatus.PENDING,
                githubScore: 0,
                appliedAt: new Date(),
            };
            await this.candidateRepository.addJobApplied(userId, jobPostId);

            const createApplication = await this.applicantRepository.createApplicant(newApplicant as IApplicant);

            if (!createApplication) {
                console.warn(`Failed to update job post ${jobPostId} with new applicant.`);
                return false;
            }

            console.log(`Candidate ${userId} successfully applied for job ${jobPostId}.`);
            return true;
        } catch (error) {
            console.error('Error creating job application:', error);
            return false;
        }
    }

    async deleteApplication(candidateId: string, jobPostId: string): Promise<boolean> {
        try {
            const applicationDeleted = await this.applicantRepository.deleteApplication(candidateId, jobPostId);
            const candidateDeleted = await this.candidateRepository.updateApplyStatus(candidateId, jobPostId, ApplyStatus.REJECTED);
            if (!applicationDeleted || !candidateDeleted) {
                console.warn(`No application found for user ${candidateId} and job ${jobPostId}.`);
                return false;
            }

            console.log(`Successfully removed application for user ${candidateId} and job ${jobPostId}.`);
            return true;
        } catch (error) {
            console.error('Error removing application:', error);
            return false;
        }
    }

    async saveJobPost(userId: string, jobSavedId: string): Promise<boolean> {
        try {
            const jobExists = await this.jobPostRepository.exists(jobSavedId);
            if (!jobExists) {
                console.warn(`Job post with ID ${jobSavedId} does not exist.`);
                return false;
            }

            const saved = await this.candidateRepository.saveJobPost(userId, jobSavedId);
            if (!saved) {
                console.warn(`Failed to save job post ${jobSavedId} for user ${userId}.`);
                return false;
            }

            console.log(`Job post ${jobSavedId} saved successfully for user ${userId}.`);
            return true;
        } catch (error) {
            console.error('Error saving job post:', error);
            return false;
        }
    }

    async unSaveJobPost(userId: string, jobPostId: string): Promise<boolean> {
        try {
            // Gọi hàm xóa trong CandidateRepository
            const removed = await this.candidateRepository.removeSavedJob(userId, jobPostId);

            if (!removed) {
                console.warn(`No jobSaved entry found with ID: ${jobPostId} for user ${userId}`);
                return false;
            }

            console.log(`Successfully removed jobSaved entry with ID: ${jobPostId}`);
            return true;
        } catch (error) {
            console.error("Error removing jobSaved entry:", error);
            return false;
        }
    }

    async setApplyStatus(userId: string, jobPostId: string, candidateId: string, status: ApplyStatus
    ): Promise<boolean> {
        try {
            const isOwner = await this.jobPostRepository.isJobOwner(userId, jobPostId);

            if (!isOwner) {
                console.warn(`User ${userId} is not the owner of job post ${jobPostId}.`);
                return false;
            }
            const updated = await this.candidateRepository.updateApplyStatus(
                jobPostId,
                candidateId,
                status
            );

            if (!updated) {
                console.warn(`Failed to update status for candidate ${candidateId}.`);
                return false;
            }

            console.log(`Applicant ${candidateId} status updated successfully.`);
            return true;
        } catch (error) {
            console.error('Error updating applicant status:', error);
            return false;
        }
    }

    async getJobPostsByRecruiter(recruiterId: string) {
        try {
            const jobPosts = await this.jobPostRepository.getJobPostsByRecruiter(recruiterId);
            log("jobPosts", jobPosts);
            const result = jobPosts.map((job) => this.toJobPostDTO(job));
            if (!result) {
                console.warn(`No job posts found for recruiter ${recruiterId}`);
                return [];
            }
            return result;
        } catch (error) {
            console.error('Error fetching job posts by recruiter:', error);
            throw new Error('Could not fetch job posts by recruiter');

        }
    }

    async getJobPostedByRecruiter(recruiterId: string): Promise<IJobPost[]> {
        try {
            const jobPosts = await this.jobPostRepository.getJobPostedByRecruiter(recruiterId);
            if (!jobPosts) {
                console.warn(`No job posts found for recruiter ${recruiterId}`);
                return [];
            }
            return jobPosts;
        } catch (error) {
            console.error('Error fetching job posts by recruiter:', error);
            throw new Error('Could not fetch job posts by recruiter');
        }
    }

    saveAIResult(userId: string, jobPostId: string, aiResult: IAIResult) {
        try {
            const isExisting = this.applicantRepository.isExistingApplicant(userId, jobPostId);
            if (!isExisting) {
                console.warn(`Applicant with ID ${userId} not found.`);
                return;
            }
            const updated = this.applicantRepository.updateAIResult(userId, jobPostId, aiResult);
            if (!updated) {
                console.warn(`Failed to update AI result for applicant ${userId}.`);
                return;
            }
            return updated !== null;
        } catch (error) {
            console.error('Error saving AI result:', error);
        }
    }

    async getTopRecruiters(): Promise<any[]> {
        try {
            const topRecruiters = await this.jobPostRepository.getTopRecruiters();
            if (!topRecruiters) {
                console.warn("No top recruiters found.");
                return [];
            }
            return topRecruiters;
        } catch (error) {
            console.error("Error fetching top recruiters:", error);
            return [];
        }
    }

    async getTopJobSalaries(): Promise<any[]> {
        try {
            const topSalaries = await this.jobPostRepository.getTopJobSalaries();
            if (!topSalaries) {
                console.warn("No top salaries found.");
                return [];
            }
            return topSalaries;
        } catch (error) {
            console.error("Error fetching top salaries:", error);
            return [];
        }
    }
}
