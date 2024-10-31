import mongoose, { Schema, Document } from 'mongoose';
import { IRecruiter } from '../interfaces/IRecruiter';

const ImageSchema = new Schema({
    imageUrl: { type: String },
    uploadedAt: { type: Date }
});

// Define the schema for the PaymentSchema
const PaymentSchema = new Schema({
    payAmount: { type: Number, required: true },
    transactionDate: { type: Date, required: true }
});

// Define the schema for the RecruiterModel
const RecruiterSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orgEmail: { type: String },
    orgName: { type: String },
    orgIntroduction: { type: String },
    orgBenefits: { type: String },
    orgField: { type: String },
    orgWebsiteUrl: { type: String },
    orgFacebookLink: { type: String },
    orgLinkedinLink: { type: String },
    orgYoutubeLink: { type: String },
    orgScale: { type: String },
    orgTaxNumber: { type: String },
    orgAddress: { type: String },
    orgImage: { type: String },
    orgCoverImage: { type: String },
    orgImages: [ImageSchema],
    payments: [PaymentSchema],
    balance: { type: Number, default: 0 }
});

// Create and export the RecruiterModel
const RecruiterModel = mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);
export default RecruiterModel;