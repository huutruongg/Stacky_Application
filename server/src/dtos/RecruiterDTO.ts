import { ObjectId } from "mongoose";

export class RecruiterDTO {
    constructor(
        public _id: ObjectId,
        public orgEmail: string,
        public orgName: string,
        public orgField: string,
        public orgScale: string,
        public orgTaxNumber: string,
        public orgAddress: string,
        public orgWebsiteUrl: string,
        public orgFacebookLink: string,
        public orgLinkedinLink: string,
        public orgYoutubeLink: string,
        public orgIntroduction: string,
        public orgBenefits: string,
        public orgImage: string,
        public orgCoverImage: string,
        public orgImages: string[],
        public phoneNumber: string
    ) {}
}
