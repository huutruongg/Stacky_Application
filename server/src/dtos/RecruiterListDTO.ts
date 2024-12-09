import { ObjectId } from "mongoose";

export default class RecruiterListDTO {
    userId: ObjectId;
    orgName: string;
    orgImage: string;
    orgCoverImage: string;
    orgIntroduction: string;
    constructor(userId: ObjectId, orgName: string, orgImage: string, orgCoverImage: string, orgIntroduction: string) {
        this.userId = userId;
        this.orgName = orgName;
        this.orgImage = orgImage;
        this.orgCoverImage = orgCoverImage;
        this.orgIntroduction = orgIntroduction;
    }

    async toDTO() {
        return {
            userId: this.userId,
            orgName: this.orgName,
            orgImage: this.orgImage,
            orgCoverImage: this.orgCoverImage,
            orgIntroduction: this.orgIntroduction
        };
    }
}