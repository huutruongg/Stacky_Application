import mongoose, { Schema, Document } from 'mongoose';
import { IRecruiter } from '../interfaces/IRecruiter';
import { encrypt, decrypt } from '../utils/encryption';

const ImageSchema = new Schema({
    imageUrl: { type: String },
    uploadedAt: { type: Date }
});

// Define the schema for the PaymentSchema
const PaymentSchema = new Schema({
    payAmount: { type: Number, required: true },
    transactionDate: { type: Date, required: true },
    isDeposit: { type: Boolean, required: true, default: false }
});

// Define the schema for the RecruiterModel
const RecruiterSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orgEmail: { type: String},
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
    orgImages: [String],
    payments: [PaymentSchema],
    balance: {
        type: String,
        set: (value: number) => {
            if (value < 0) {
                value = 0;
            }
            return encrypt(value);
        },
        get: (value: string) => {
            try {
                return parseFloat(decrypt(value));
            } catch (error) {
                return 0; 
            }
        }
    },
}, {
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Create and export the RecruiterModel
const RecruiterModel = mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);
export default RecruiterModel;