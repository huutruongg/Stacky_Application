import admin, { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from '../../config/firebase-admin.json';
import { log } from 'console';

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount), // Cast to ServiceAccount type
    storageBucket: 'gs://stackydemo-95381.appspot.com',
});

const bucket = admin.storage().bucket();

const UploadService = {
    getPublicUrlImages: async (files: Express.Multer.File[], folderName: string): Promise<string[]> => {
        const uploadedFileUrls: string[] = [];

        for (const file of files) {
            const fileBuffer = file.buffer; // Get the file buffer
            const uniqueFileName = `${Date.now()}-${file.originalname}`;

            // Upload to Firebase Storage
            const fileRef = bucket.file(`${folderName}/${uniqueFileName}`);
            await fileRef.save(fileBuffer, {
                public: true, // Make the file publicly accessible
            });

            // Get the public URL of the uploaded file
            const fileUrl = `https://storage.googleapis.com/${bucket.name}/${folderName}/${uniqueFileName}`;
            uploadedFileUrls.push(fileUrl); // Push the public URL to the array
        }

        return uploadedFileUrls;
    },

    deleteImage: async (fileIds: string[], folderPath: string): Promise<boolean> => {
        try {
            const bucket = admin.storage().bucket();

            for (const fileId of fileIds) {
                const fileName = fileId.split('/').pop();
                const filePath = `${folderPath}/${fileName}`;
                const file = bucket.file(filePath);
                const [exists] = await file.exists();
                if (!exists) {
                    console.error(`Error: File does not exist: ${filePath}`);
                    continue; // Skip to the next file
                }
                try {
                    await file.delete();
                    console.log(`Image deleted successfully: ${filePath}`);
                } catch (err) {
                    console.error('Error deleting image:', err);
                }
            }

            console.log('All file deletion attempts completed.');
            return true;

        } catch (error) {
            console.error('Error during image deletion process:', error);
            return false;
        }
    }
};

export default UploadService;
