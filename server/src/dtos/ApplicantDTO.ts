export default class ApplicantDTO {
    constructor(
        public jobPostId: string,
        public userId: string,
        public fullName: string,
        public publicEmail: string,
        public avatarUrl: string,
        public personalDescription: string,
        public totalScore: number,
        public githubScore: number,
        public appliedAt: Date
    ) {}
}
