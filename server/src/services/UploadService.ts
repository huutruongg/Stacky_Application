import admin, { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from '../config/Firebase.json';
import { Bucket } from '@google-cloud/storage';

export default class UploadService {
    private bucket: Bucket;

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount),
            storageBucket: process.env.STORAGE_BUCKET,
        });

        this.bucket = admin.storage().bucket();
    }

    public async uploadImagesToFirebase(
        files: Express.Multer.File[],
        folderName: string
    ): Promise<string[]> {
        const uploadedFileUrls: string[] = [];

        for (const file of files) {
            const uniqueFileName = `${Date.now()}-${file.originalname}`;
            const fileRef = this.bucket.file(`${folderName}/${uniqueFileName}`);

            try {
                // Sử dụng createWriteStream để upload file
                const stream = fileRef.createWriteStream({
                    metadata: {
                        contentType: file.mimetype,
                    },
                    public: true, // Đặt file ở chế độ public
                    resumable: false, // Tắt resumable để đơn giản hóa
                });

                stream.end(file.buffer); // Ghi dữ liệu vào stream

                const fileUrl = `https://storage.googleapis.com/${this.bucket.name}/${folderName}/${uniqueFileName}`;
                uploadedFileUrls.push(fileUrl);
                console.log(`Uploaded: ${fileUrl}`);
            } catch (error) {
                console.error(`Failed to upload ${file.originalname}:`, error);
            }
        }

        return uploadedFileUrls;
    }

    public async deleteImages(fileIds: string[], folderPath: string): Promise<boolean> {
        try {
            for (const fileId of fileIds) {
                const fileName = fileId.split('/').pop();
                if (!fileName) {
                    console.warn(`Invalid file ID: ${fileId}`);
                    continue;
                }

                const filePath = `${folderPath}/${fileName}`;
                const file = this.bucket.file(filePath);

                const [exists] = await file.exists();
                if (!exists) {
                    console.error(`File not found: ${filePath}`);
                    continue;
                }

                try {
                    await file.delete();
                    console.log(`Deleted: ${filePath}`);
                } catch (error) {
                    console.error(`Error deleting ${filePath}:`, error);
                }
            }

            console.log('All deletions completed.');
            return true;
        } catch (error) {
            console.error('Error during deletion process:', error);
            return false;
        }
    }
}
