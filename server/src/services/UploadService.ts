import admin, { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from '../config/Firebase.json';

export default class UploadService {
    private bucket;

    constructor() {
        // Initialize Firebase Admin SDK
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as ServiceAccount),
                storageBucket: process.env.STORAGE_BUCKET,
            });
        }

        this.bucket = admin.storage().bucket();
    }

    public getPublicUrlImages = async (files: Express.Multer.File[], folderName: string): Promise<string[]> => {
        const uploadedFileUrls: string[] = [];

        for (const file of files) {
            const fileBuffer = file.buffer; // Get the file buffer
            const uniqueFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;

            // Upload to Firebase Storage
            const fileRef = this.bucket.file(`${folderName}/${uniqueFileName}`);
            await fileRef.save(fileBuffer, {
                public: true, // Make the file publicly accessible
            });

            // Get the public URL of the uploaded file
            const fileUrl = `https://storage.googleapis.com/${this.bucket.name}/${folderName}/${uniqueFileName}`;
            uploadedFileUrls.push(fileUrl); // Push the public URL to the array
        }

        return uploadedFileUrls;
    };

    public deleteImages = async (fileIds: string[], folderPath: string): Promise<boolean> => {
        try {
            const deletePromises = fileIds.map(async (fileId) => {
                const fileName = fileId.split('/').pop();
                const filePath = `${folderPath}/${fileName}`;
                const file = this.bucket.file(filePath);
                const [exists] = await file.exists();

                if (!exists) {
                    console.error(`Error: File does not exist: ${filePath}`);
                    return;
                }

                try {
                    await file.delete();
                    console.log(`Image deleted successfully: ${filePath}`);
                } catch (err) {
                    console.error('Error deleting image:', err);
                }
            });

            await Promise.all(deletePromises);
            console.log('All file deletion attempts completed.');
            return true;
        } catch (error) {
            console.error('Error during image deletion process:', error);
            return false;
        }
    };
}
