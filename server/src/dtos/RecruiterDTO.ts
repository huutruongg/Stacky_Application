export class RecruiterDTO {
    _id: number;
    orgEmail: string;
    orgName: string;
    orgField: string;
    orgScale: string;
    orgTaxNumber: string;
    orgAddress: string;
    images: string[];

    constructor(
        _id: number,
        orgEmail: string,
        orgName: string,
        orgField: string,
        orgScale: string,
        orgTaxNumber: string,
        orgAddress: string,
        images: string[]
    ) {
        this._id = _id;
        this.orgEmail = orgEmail;
        this.orgName = orgName;
        this.orgField = orgField;
        this.orgScale = orgScale;
        this.orgTaxNumber = orgTaxNumber;
        this.orgAddress = orgAddress;
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
            images: this.images
        };
    }
}