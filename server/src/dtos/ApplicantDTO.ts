export default class ApplicantDTO {
    jobPostId: string;
    userId: string;
    fullName: string;
    publicEmail?: string;
    avatarUrl: string;
    personalDescription: string;
    totalScore: number;
    githubScore: number;
    appliedAt: Date;

    constructor(jobPostId: string, userId: string, fullName: string, publicEmail: string, avatarUrl: string, personalDescription: string, totalScore: number, githubScore: number, appliedAt: Date) {
        this.jobPostId = jobPostId;
        this.userId = userId;
        this.fullName = fullName;
        this.publicEmail = publicEmail;
        this.avatarUrl = avatarUrl;
        this.personalDescription = personalDescription;
        this.totalScore = totalScore;
        this.githubScore = githubScore;
        this.appliedAt = appliedAt;
    }

    async toDTO() {
        return {
            jobPostId: this.jobPostId,
            userId: this.userId,
            fullName: this.fullName,
            publicEmail: this.publicEmail,
            avatarUrl: this.avatarUrl,
            personalDescription: this.personalDescription,
            totalScore: this.totalScore,
            githubScore: this.githubScore,
            appliedAt: this.appliedAt
        };
    }
}