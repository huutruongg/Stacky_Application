export interface IExperience extends Document {
    companyName: string;
    startDate: Date;
    endDate?: Date;
    jobPosition: string;
    previousJobDetails: string;
}