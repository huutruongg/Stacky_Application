import admin, { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from '../config/firebase-admin.json';

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount), // Cast to ServiceAccount type
    storageBucket: 'gs://stackydemo-95381.appspot.com',
});

const bucket = admin.storage().bucket();

const UploadService = {
    getPublicUrlImage: async (file: Express.Multer.File, folderName: string): Promise<string> => {
        const uniqueFileName = `${Date.now()}-${file.originalname}`;
        const fileUpload = bucket.file(`${folderName}/${uniqueFileName}`);

        try {
            // Upload the file to Firebase Storage
            await fileUpload.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype,
                },
            });

            // Get the public URL of the uploaded file
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
            return publicUrl;
        } catch (error) {
            console.error('Error uploading file to Firebase Storage:', error);
            throw new Error('Failed to upload file');
        }
    },
};

export default UploadService;
