import { Types } from "mongoose";
import { ApplyStatus } from "../enums/EApplySatus";

export class JobAppliedDTO {
    constructor(
        public _id: Types.ObjectId,
        public jobTitle: string,
        public jobImage: string,
        public orgName: string,
        public status: ApplyStatus,
        public location: string,
        public applicationDeadline: Date,
        public userId: string
    ) {}
}
