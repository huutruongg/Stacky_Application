export default class ApplicantDTO {
    fullName: string;
    publicEmail?: string;
    avatarUrl: string;
    personalDescription: string;
    appliedAt: Date;

    constructor(fullName: string, publicEmail: string, avatarUrl: string, personalDescription: string, appliedAt: Date) {
        this.fullName = fullName;
        this.publicEmail = publicEmail;
        this.avatarUrl = avatarUrl;
        this.personalDescription = personalDescription;
        this.appliedAt = appliedAt;
    }

    async toJSON() {
        return {
            fullName: this.fullName,
            publicEmail: this.publicEmail,
            avatarUrl: this.avatarUrl,
            personalDescription: this.personalDescription,
            appliedAt: this.appliedAt
        };
    }
}