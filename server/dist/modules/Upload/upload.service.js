"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccount = __importStar(require("../../config/firebase-admin.json"));
// Initialize Firebase Admin SDK
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount), // Cast to ServiceAccount type
    storageBucket: process.env.STORAGE_BUCKET,
});
const bucket = firebase_admin_1.default.storage().bucket();
const UploadService = {
    getPublicUrlImages: (files, folderName) => __awaiter(void 0, void 0, void 0, function* () {
        const uploadedFileUrls = [];
        for (const file of files) {
            const fileBuffer = file.buffer; // Get the file buffer
            const uniqueFileName = `${Date.now()}-${file.originalname}`;
            // Upload to Firebase Storage
            const fileRef = bucket.file(`${folderName}/${uniqueFileName}`);
            yield fileRef.save(fileBuffer, {
                public: true, // Make the file publicly accessible
            });
            // Get the public URL of the uploaded file
            const fileUrl = `https://storage.googleapis.com/${bucket.name}/${folderName}/${uniqueFileName}`;
            uploadedFileUrls.push(fileUrl); // Push the public URL to the array
        }
        return uploadedFileUrls;
    }),
    deleteImage: (fileIds, folderPath) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bucket = firebase_admin_1.default.storage().bucket();
            for (const fileId of fileIds) {
                const fileName = fileId.split('/').pop();
                const filePath = `${folderPath}/${fileName}`;
                const file = bucket.file(filePath);
                const [exists] = yield file.exists();
                if (!exists) {
                    console.error(`Error: File does not exist: ${filePath}`);
                    continue; // Skip to the next file
                }
                try {
                    yield file.delete();
                    console.log(`Image deleted successfully: ${filePath}`);
                }
                catch (err) {
                    console.error('Error deleting image:', err);
                }
            }
            console.log('All file deletion attempts completed.');
            return true;
        }
        catch (error) {
            console.error('Error during image deletion process:', error);
            return false;
        }
    })
};
exports.default = UploadService;
