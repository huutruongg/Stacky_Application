import { ObjectId } from "mongoose";

export default class RecruiterListDTO {
    id: ObjectId;
    orgName: string;
    orgImage: string;
    orgCoverImage: string;
    orgIntroduction: string;
    constructor(id: ObjectId, orgName: string, orgImage: string, orgCoverImage: string, orgIntroduction: string) {
        this.id = id;
        this.orgName = orgName;
        this.orgImage = orgImage;
        this.orgCoverImage = orgCoverImage;
        this.orgIntroduction = orgIntroduction;
    }

    async toDTO() {
        return {
            id: this.id,
            orgName: this.orgName,
            orgImage: this.orgImage,
            orgCoverImage: this.orgCoverImage,
            orgIntroduction: this.orgIntroduction
        };
    }
}