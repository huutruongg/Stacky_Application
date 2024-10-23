import { Request, Response } from 'express';
import UploadService from '../services/UploadService';
import { BaseController } from './BaseController';

export default class UploadFileController extends BaseController { 
    private uploadService: UploadService;   
    constructor(uploadService: UploadService) {
        super();
        this.uploadService = uploadService
    }

    public async uploadImages(req: Request, res: Response, folderName: 'Recruiters' | 'Candidates'): Promise<void> {
        const files = req.files as Express.Multer.File[];

        if (files && files.length > 0) {
            try {
                // Upload images and get public URLs
                const publicUrls: string[] = await this.uploadService.getPublicUrlImages(files, folderName);
                res.status(200).json({ success: true, message: 'Images uploaded successfully', urlImages: publicUrls });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Failed to upload images' });
            }
        } else {
            res.status(400).json({ success: false, error: 'No image files provided' });
        }
    }

    public async uploadRecruiterImages(req: Request, res: Response): Promise<void> {
        await this.uploadImages(req, res, 'Recruiters');
    }

    public async uploadCandidateImages(req: Request, res: Response): Promise<void> {
        await this.uploadImages(req, res, 'Candidates');
    }

    public async deleteImages(req: Request, res: Response, folderName: 'Recruiters' | 'Candidates'): Promise<void> {
        try {
            const { fileIds } = req.body;
            const isDeleted = await this.uploadService.deleteImages(fileIds, folderName);

            if (!isDeleted) {
                res.status(500).json({ success: false, error: 'Failed to delete images' });
                return;
            }

            res.status(200).json({ success: true, message: 'Images deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Failed to delete images' });
        }
    }

    public async deleteRecruiterImages(req: Request, res: Response): Promise<void> {
        await this.deleteImages(req, res, 'Recruiters');
    }

    public async deleteCandidateImages(req: Request, res: Response): Promise<void> {
        await this.deleteImages(req, res, 'Candidates');
    }
}
