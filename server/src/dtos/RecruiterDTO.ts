import { ObjectId } from "mongoose";
import { IImage } from "../interfaces/IImage";

export class RecruiterDTO {
    _id: ObjectId;
    orgEmail: string;
    orgName: string;
    orgField: string;
    orgScale: string;
    orgTaxNumber: string;
    orgAddress: string;
    orgImage: string;
    coverImage: string;
    images: IImage[];

    constructor(
        _id: ObjectId,
        orgEmail: string,
        orgName: string,
        orgField: string,
        orgScale: string,
        orgTaxNumber: string,
        orgAddress: string,
        orgImage: string,
        coverImage: string,
        images: IImage[]
    ) {
        this._id = _id;
        this.orgEmail = orgEmail;
        this.orgName = orgName;
        this.orgField = orgField;
        this.orgScale = orgScale;
        this.orgTaxNumber = orgTaxNumber;
        this.orgAddress = orgAddress;
        this.orgImage = orgImage;
        this.coverImage = coverImage;
        this.images = images;
    }

    toJSON() {
        return {
            _id: this._id,
            orgEmail: this.orgEmail,
            orgName: this.orgName,
            orgField: this.orgField,
            orgScale: this.orgScale,
            orgTaxNumber: this.orgTaxNumber,
            orgAddress: this.orgAddress,
            orgImage: this.orgImage,
            coverImage: this.coverImage,
            images: this.images
        };
    }
}