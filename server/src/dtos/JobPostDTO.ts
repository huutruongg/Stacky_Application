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

    static from(dto: JobPostDTO) {
        return new JobPostDTO(
            dto._id,
            dto.jobTitle,
            dto.jobImage,
            dto.orgName,
            dto.jobSalary,
            dto.location,
            dto.applicationDeadline,
            dto.userId
        );
    }

    
}
