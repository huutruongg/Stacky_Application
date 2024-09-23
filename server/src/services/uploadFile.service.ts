const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-admin.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://stackydemo-95381.appspot.com' 
});
const bucket = admin.storage().bucket();

const UploadService = {
    getPubicUrlImage: async (file: Express.Multer.File, folderName: string): Promise<string> => {
        const uniqueFileName = `${Date.now()}-${file.originalname}`;

        // Upload the file to Firebase Storage

        const fileUpload = bucket.file(`${folderName}/${uniqueFileName}`); // Specify the folder "Recruiters"
        await fileUpload.save(file.buffer);  // Save buffer directly

        // Get the public URL of the uploaded file
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/Recruiters%2F${encodeURIComponent(uniqueFileName)}?alt=media`;
        return publicUrl;
    }
}

export default UploadService;
