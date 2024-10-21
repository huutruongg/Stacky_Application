import { BaseController } from "./BaseController";
import UploadService from "../services/UploadService";
import { Request, Response } from "express";

export default class UploadController extends BaseController {
    private uploadService: UploadService;

    constructor(uploadService: UploadService) {
        super();
        this.uploadService = uploadService;
    }

    public async uploadRecruiterImages(req: Request, res: Response): Promise<void> {
        try {
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return this.sendError(res, 400, 'No files uploaded.');
            }

            const uploadedFileUrls = await this.uploadService.uploadImagesToFirebase(files, 'Recruiters');
            return this.sendResponse(res, 200, { success: true, message: 'Images uploaded successfully', urlImages: uploadedFileUrls });
        } catch (error) {
            console.error('Error uploading recruiter images:', error);
            return this.sendError(res, 500, 'An error occurred while uploading recruiter images.');
        }
    }

    public async uploadCandidateImages(req: Request, res: Response): Promise<void> {
        try {
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return this.sendError(res, 400, 'No files uploaded.');
            }

            const uploadedFileUrls = await this.uploadService.uploadImagesToFirebase(files, 'Candidates');
            return this.sendResponse(res, 200, { success: true, message: 'Images uploaded successfully', urlImages: uploadedFileUrls });
        } catch (error) {
            console.error('Error uploading candidate images:', error);
            return this.sendError(res, 500, 'An error occurred while uploading candidate images.');
        }
    }

    public async deleteRecruiterImages(req: Request, res: Response): Promise<void> {
        try {
            const { fileIds } = req.body;
            const isDeleted = await this.uploadService.deleteImages(fileIds, 'Recruiters');
            if (!isDeleted) {
                return this.sendError(res, 500, 'Failed to delete recruiter images.');
            }
            return this.sendResponse(res, 200, 'Images deleted successfully.');
        } catch (error) {
            console.error('Error deleting recruiter images:', error);
            return this.sendError(res, 500, 'An error occurred while deleting recruiter images.');
        }
    }

    public async deleteCandidateImages(req: Request, res: Response): Promise<void> {
        try {
            const { fileIds } = req.body;
            const isDeleted = await this.uploadService.deleteImages(fileIds, 'Candidates');
            if (!isDeleted) {
                return this.sendError(res, 500, 'Failed to delete candidate images.');
            }
            return this.sendResponse(res, 200, 'Images deleted successfully.');
        } catch (error) {
            console.error('Error deleting candidate images:', error);
            return this.sendError(res, 500, 'An error occurred while deleting candidate images.');
        }
    }
}
