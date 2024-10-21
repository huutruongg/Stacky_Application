// src/dtos/job-post.dto.ts

import { Types } from "mongoose";

export class JobPostDTO {
    _id: Types.ObjectId;
    jobTitle: string;
    jobImage: string;
    orgName: string;
    jobSalary: string;
    location: string;
    applicationDeadline: Date;
    userId: string;

    constructor(
        _id: Types.ObjectId,
        jobTitle: string,
        jobImage: string,
        orgName: string,
        jobSalary: string,
        location: string,
        applicationDeadline: Date,
        userId: string
    ) {
        this._id = _id;
        this.jobTitle = jobTitle;
        this.jobImage = jobImage;
        this.orgName = orgName;
        this.jobSalary = jobSalary;
        this.location = location;
        this.applicationDeadline = applicationDeadline;
        this.userId = userId;
    }

    // Optional: Add transformation or formatting methods if needed
    toJSON() {
        return {
            _id: String(this._id),
            jobTitle: this.jobTitle,
            jobImage: this.jobImage,
            orgName: this.orgName,
            jobSalary: this.jobSalary,
            location: this.location,
            applicationDeadline: this.applicationDeadline,
            userId: this.userId
        };
    }
}
