// src/dtos/job-post.dto.ts

import { Types } from "mongoose";
import { ApplyStatus } from "../enums/EApplySatus";

export class JobAppliedDTO {
    _id: Types.ObjectId;
    jobTitle: string;
    jobImage: string;
    orgName: string;
    location: string;
    status: ApplyStatus;
    applicationDeadline: Date;
    userId: string;

    constructor(
        _id: Types.ObjectId,
        jobTitle: string,
        jobImage: string,
        orgName: string,
        status: ApplyStatus,
        location: string,
        applicationDeadline: Date,
        userId: string
    ) {
        this._id = _id;
        this.jobTitle = jobTitle;
        this.jobImage = jobImage;
        this.orgName = orgName;
        this.status = status;
        this.location = location;
        this.applicationDeadline = applicationDeadline;
        this.userId = userId;
    }

    async toDTO() {
        return {
            _id: String(this._id),
            jobTitle: this.jobTitle,
            jobImage: this.jobImage,
            orgName: this.orgName,
            status: this.status,
            location: this.location,
            applicationDeadline: this.applicationDeadline,
            userId: this.userId
        };
    }
}
