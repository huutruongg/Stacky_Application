import { Request, Response } from 'express';
import UploadService from './upload.service';
import { log } from 'console';

const UploadFileController = {
    uploadImages: async (req: Request, res: Response, folderName: 'Recruiters' | 'Candidates'): Promise<void> => {
        const files = req.files as Express.Multer.File[]; // Cascating req.files to File[]

        if (files && files.length > 0) {
            try {
                // Upload images and get public URLs
                const publicUrls: string[] = await UploadService.getPublicUrlImages(files, folderName);
                res.status(200).json({ success: true, message: 'Images uploaded successfully', urlImages: publicUrls });
            } catch (error) {
                log(error);
                res.status(500).json({ success: false, error: 'Failed to upload images' });
            }
        } else {
            res.status(400).json({ success: false, error: 'No image files provided' });
        }
    },

    uploadRecruiterImages: function (req: Request, res: Response): Promise<void> {
        return UploadFileController.uploadImages(req, res, 'Recruiters');
    },

    uploadCandidateImages: function (req: Request, res: Response): Promise<void> {
        return UploadFileController.uploadImages(req, res, 'Candidates');
    },

    deleteImage: async (req: Request, res: Response, folderName: 'Recruiters' | 'Candidates'): Promise<void> => {
        try {
            const { fileIds } = req.body;
            const isDeleted = await UploadService.deleteImage(fileIds, folderName);
            if (!isDeleted) {
                res.status(500).json({ success: false, error: 'Failed to delete images' });
                return;
            }
            res.status(200).json({ success: true, message: 'Images deleted successfully' });
        } catch (error) {
            log(error);
            res.status(500).json({ success: false, error: 'Failed to delete images' });
        }
    },

    deleteRecruiterImages: function (req: Request, res: Response): Promise<void> {
        return UploadFileController.deleteImage(req, res, 'Recruiters');
    },

    deleteCandidateImages: function (req: Request, res: Response): Promise<void> {
        return UploadFileController.deleteImage(req, res, 'Candidates');
    },
};

export default UploadFileController;
