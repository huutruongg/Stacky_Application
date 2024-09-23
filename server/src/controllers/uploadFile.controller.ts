
import { Request, Response } from 'express'
import UploadService from '../services/uploadFile.service';

const UploadFileController = {
    uploadRecuiterImage: async (req: Request, res: Response): Promise<void> => {
        if (req.file) {
            try {
                // Get the uploaded file
                const file = req.file;
                // Create a unique file name
                const publicUrl: string = await UploadService.getPubicUrlImage(file, "Recruiters");
                res.status(200).json({ message: 'Image uploaded successfully', url: publicUrl });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to upload image' });
            }
        } else {
            res.status(400).json({ error: 'No image file provided' });
        }
    },

    uploadCandidateImage: async (req: Request, res: Response): Promise<void> => {
        if (req.file) {
            try {
                // Get the uploaded file
                const file = req.file;
                // Create a unique file name
                const publicUrl: string = await UploadService.getPubicUrlImage(file, "Candidates");
                res.status(200).json({ message: 'Image uploaded successfully', url: publicUrl });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to upload image' });
            }
        } else {
            res.status(400).json({ error: 'No image file provided' });
        }
    }
}

export default UploadFileController;