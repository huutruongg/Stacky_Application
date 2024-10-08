"use strict";
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
const upload_service_1 = __importDefault(require("./upload.service"));
const console_1 = require("console");
const UploadFileController = {
    uploadImages: (req, res, folderName) => __awaiter(void 0, void 0, void 0, function* () {
        const files = req.files; // Cascating req.files to File[]
        if (files && files.length > 0) {
            try {
                // Upload images and get public URLs
                const publicUrls = yield upload_service_1.default.getPublicUrlImages(files, folderName);
                res.status(200).json({ success: true, message: 'Images uploaded successfully', urlImages: publicUrls });
            }
            catch (error) {
                (0, console_1.log)(error);
                res.status(500).json({ success: false, error: 'Failed to upload images' });
            }
        }
        else {
            res.status(400).json({ success: false, error: 'No image files provided' });
        }
    }),
    uploadRecruiterImages: function (req, res) {
        return UploadFileController.uploadImages(req, res, 'Recruiters');
    },
    uploadCandidateImages: function (req, res) {
        return UploadFileController.uploadImages(req, res, 'Candidates');
    },
    deleteImage: (req, res, folderName) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { fileIds } = req.body;
            const isDeleted = yield upload_service_1.default.deleteImage(fileIds, folderName);
            if (!isDeleted) {
                res.status(500).json({ success: false, error: 'Failed to delete images' });
                return;
            }
            res.status(200).json({ success: true, message: 'Images deleted successfully' });
        }
        catch (error) {
            (0, console_1.log)(error);
            res.status(500).json({ success: false, error: 'Failed to delete images' });
        }
    }),
    deleteRecruiterImages: function (req, res) {
        return UploadFileController.deleteImage(req, res, 'Recruiters');
    },
    deleteCandidateImages: function (req, res) {
        return UploadFileController.deleteImage(req, res, 'Candidates');
    },
};
exports.default = UploadFileController;
