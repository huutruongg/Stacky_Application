import { Types } from "mongoose";

export class JobPostDTO {
    constructor(
        public _id: Types.ObjectId,
        public jobTitle: string,
        public jobImage: string,
        public orgName: string,
        public jobSalary: string,
        public location: string,
        public applicationDeadline: Date,
        public userId: string
    ) {}
}
