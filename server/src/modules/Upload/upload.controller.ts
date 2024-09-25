import { Request, Response } from 'express';
import UploadService from './uploadFile.service';

const UploadFileController = {
    uploadImage: async (req: Request, res: Response, role: 'Recruiters' | 'Candidates'): Promise<void> => {
        if (req.file) {
            try {
                // Get the uploaded file
                const file = req.file;
                // Create a unique file name
                const publicUrl: string = await UploadService.getPublicUrlImage(file, role);
                res.status(200).json({ success: true, message: 'Image uploaded successfully', urlImage: publicUrl });
            } catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: 'Failed to upload image' });
            }
        } else {
            res.status(400).json({ success: false, error: 'No image file provided' });
        }
    },

    uploadRecruiterImage: function(req: Request, res: Response): Promise<void> {
        return UploadFileController.uploadImage(req, res, 'Recruiters');
    },

    uploadCandidateImage: function(req: Request, res: Response): Promise<void> {
        return UploadFileController.uploadImage(req, res, 'Candidates');
    }
};

export default UploadFileController;
