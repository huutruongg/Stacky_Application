import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const JSON_SERVER_URL = 'http://localhost:3000';

// Định nghĩa các collection cần đồng bộ
const COLLECTIONS = [
    'revenuereports',
    'users',
    'jobposts',
    'recruiters',
    'candidates',
    'notifications',
    'applicants'
];

// Tạo schema cho từng collection
const createSchemas = () => {
    const commonOptions = { strict: false, versionKey: false, timestamps: true };

    const schemas: { [key: string]: mongoose.Schema } = {
        revenuereports: new mongoose.Schema({}, commonOptions),
        users: new mongoose.Schema({}, commonOptions),
        jobposts: new mongoose.Schema({}, commonOptions),
        recruiters: new mongoose.Schema({}, commonOptions),
        candidates: new mongoose.Schema({}, commonOptions),
        notifications: new mongoose.Schema({}, commonOptions),
        applicants: new mongoose.Schema({}, commonOptions)
    };

    return schemas;
};

const syncJsonToMongoDB = async () => {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.DATABASE_URI as string);
        console.log('Connected to MongoDB');

        // Tạo schemas
        const schemas = createSchemas();

        // Đồng bộ từng collection
        for (const collectionName of COLLECTIONS) {
            try {
                // Lấy dữ liệu từ endpoint tương ứng
                console.log(`Fetching data from ${collectionName} endpoint...`);
                const response = await axios.get(`${JSON_SERVER_URL}/${collectionName}`);
                const documents = response.data;

                // Kiểm tra dữ liệu nhận được
                console.log(`Received ${documents.length} documents from ${collectionName}`);

                // Tạo hoặc lấy model cho collection
                let Model;
                try {
                    Model = mongoose.model(collectionName);
                } catch {
                    Model = mongoose.model(collectionName, schemas[collectionName]);
                }

                // Xóa dữ liệu cũ
                await Model.deleteMany({});
                console.log(`Cleared collection: ${collectionName}`);

                if (Array.isArray(documents) && documents.length > 0) {
                    // Xử lý documents
                    const processedDocs = documents.map(doc => ({
                        ...doc,
                        _id: doc._id ? new mongoose.Types.ObjectId(doc._id) : new mongoose.Types.ObjectId()
                    }));

                    // Thêm documents mới
                    await Model.insertMany(processedDocs);
                    console.log(`Successfully inserted ${documents.length} documents into collection: ${collectionName}`);
                } else {
                    console.log(`No documents to insert for collection: ${collectionName}`);
                }
            } catch (error: any) {
                if (error.response) {
                    console.error(`Error fetching ${collectionName}:`, error.response.status, error.response.statusText);
                } else {
                    console.error(`Error processing collection ${collectionName}:`, error.message);
                }
            }
        }

        console.log('Data synchronization completed successfully');
    } catch (error: any) {
        console.error('Error during synchronization:', error.message);
        throw error;
    } finally {
        // Đóng kết nối
        await mongoose.disconnect();
        console.log('MongoDB connection closed');
    }
};

export default syncJsonToMongoDB;