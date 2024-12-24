import { ObjectId } from "mongoose";

export default class RecruiterListDTO {
    constructor(
        public userId: ObjectId,
        public orgName: string,
        public orgImage: string,
        public orgCoverImage: string,
        public orgIntroduction: string
    ) { }
}
