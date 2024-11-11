import { ObjectId } from "mongoose";
import { IImage } from "../interfaces/IImage";

export class RecruiterDTO {
    _id: ObjectId;
    orgEmail: string;
    orgName: string;
    orgField: string;
    orgScale: string;
    orgWebsiteUrl: string;
    orgFacebookLink: string;
    orgLinkedinLink: string;
    orgYoutubeLink: string;
    orgIntroduction: string;
    orgBenefits: string;
    orgTaxNumber: string;
    orgAddress: string;
    orgImage: string;
    orgCoverImage: string;
    orgImages: IImage[];

    constructor(
        _id: ObjectId,
        orgEmail: string,
        orgName: string,
        orgField: string,
        orgScale: string,
        orgTaxNumber: string,
        orgAddress: string,
        orgWebsiteUrl: string,
        orgFacebookLink: string,
        orgLinkedinLink: string,
        orgYoutubeLink: string,
        orgIntroduction: string,
        orgBenefits: string,
        orgImage: string,
        orgCoverImage: string,
        orgImages: IImage[]
    ) {
        this._id = _id;
        this.orgEmail = orgEmail;
        this.orgName = orgName;
        this.orgField = orgField;
        this.orgScale = orgScale;
        this.orgTaxNumber = orgTaxNumber;
        this.orgAddress = orgAddress;
        this.orgWebsiteUrl = orgWebsiteUrl;
        this.orgFacebookLink = orgFacebookLink;
        this.orgLinkedinLink = orgLinkedinLink;
        this.orgYoutubeLink = orgYoutubeLink;
        this.orgIntroduction = orgIntroduction;
        this.orgBenefits = orgBenefits;
        this.orgImage = orgImage;
        this.orgCoverImage = orgCoverImage;
        this.orgImages = orgImages;
    }

    async toDTO() {
        return {
            _id: this._id,
            orgEmail: this.orgEmail,
            orgName: this.orgName,
            orgField: this.orgField,
            orgScale: this.orgScale,
            orgTaxNumber: this.orgTaxNumber,
            orgAddress: this.orgAddress,
            orgWebsiteUrl: this.orgWebsiteUrl,
            orgFacebookLink: this.orgFacebookLink,
            orgLinkedinLink: this.orgLinkedinLink,
            orgYoutubeLink: this.orgYoutubeLink,
            orgIntroduction: this.orgIntroduction,
            orgBenefits: this.orgBenefits,
            orgImage: this.orgImage,
            orgCoverImage: this.orgCoverImage,
            orgImages: this.orgImages
        };
    }
}