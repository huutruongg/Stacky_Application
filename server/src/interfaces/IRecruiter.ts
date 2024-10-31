import { Document } from "mongoose";
import { IImage } from "./IImage";
import { IUser } from "./IUser";
import { IPayment } from "./IPayment";

export interface IRecruiter extends Document {
    userId: IUser['_id'];
    orgEmail: string;
    orgName: string;
    orgIntroduction: string;
    orgBenefits: string;
    orgField: string;
    orgScale: string;
    orgWebsiteUrl: string;
    orgFacebookLink: string;
    orgLinkedinLink: string;
    orgYoutubeLink: string;
    orgTaxNumber: string;
    orgAddress: string;
    orgImage: string;
    orgCoverImage: string;
    orgImages: IImage[];
    payments: IPayment[],
    balance: number;
}

export interface IOrganizationName {
    _id: IRecruiter['_id'];
    orgName: string;
    userId: IUser['_id'];
}
