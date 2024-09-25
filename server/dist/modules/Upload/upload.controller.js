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
const uploadFile_service_1 = __importDefault(require("./uploadFile.service"));
const UploadFileController = {
    uploadImage: (req, res, role) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.file) {
            try {
                // Get the uploaded file
                const file = req.file;
                // Create a unique file name
                const publicUrl = yield uploadFile_service_1.default.getPublicUrlImage(file, role);
                res.status(200).json({ success: true, message: 'Image uploaded successfully', urlImage: publicUrl });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Failed to upload image' });
            }
        }
        else {
            res.status(400).json({ success: false, error: 'No image file provided' });
        }
    }),
    uploadRecruiterImage: function (req, res) {
        return UploadFileController.uploadImage(req, res, 'Recruiters');
    },
    uploadCandidateImage: function (req, res) {
        return UploadFileController.uploadImage(req, res, 'Candidates');
    }
};
exports.default = UploadFileController;
