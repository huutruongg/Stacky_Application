import mongoose from 'mongoose';
import cron from 'node-cron';
import axios from 'axios';
import { connectDB, disconnectDB } from '../config/Database';
import path from 'path';
import fs from 'fs';

const DB_JSON_PATH = path.join(__dirname, '../backup/db.json'); // Đường dẫn tới file db.json
const JSON_SERVER_URL = 'http://localhost:3000'; // URL của JSON Server

// Hàm lấy dữ liệu từ MongoDB và đẩy vào JSON Server
const syncDataToJsonServer = async () => {
    try {
        if (!mongoose.connection.db) {
            throw new Error('Database connection is not established');
        }
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Found collections:', collections.map((col) => col.name));

        for (const collection of collections) {
            const collectionName = collection.name;
            const model = mongoose.connection.db.collection(collectionName);

            // Lấy tất cả documents từ MongoDB
            const documents = await model.find({}).toArray();
            console.log(`Exporting ${documents.length} documents from collection: ${collectionName}`);

            // Gửi dữ liệu đến JSON Server
            for (const doc of documents) {
                try {
                    const formattedDoc = { ...doc, id: doc._id.toString() };
                    const { _id, ...docWithoutId } = formattedDoc; // Extract _id without modifying the original object
                    await axios.post(`${JSON_SERVER_URL}/${collectionName}`, docWithoutId, {
                        headers: { 'Content-Type': 'application/json' },
                    });
                } catch (error: any) {
                    console.error(`Failed to save document to JSON Server in collection: ${collectionName}`, error.message);
                }
            }
        }
    } catch (error: any) {
        console.error('Error during MongoDB to JSON Server sync:', error.message);
    }
};


// Hàm reset db.json bằng cách ghi đè file
const resetJsonServer = async () => {
    try {
        const initialData = {
            revenuereports: [],
            users: [],
            jobposts: [],
            recruiters: [],
            candidates: [],
            notifications: [],
            applicants: [],
        };
        // Ghi đè file db.json với nội dung rỗng
        fs.writeFileSync(DB_JSON_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
        console.log('JSON Server database has been reset directly by overwriting db.json.');
    } catch (error: any) {
        console.error('Failed to reset JSON Server database:', error.message);
        throw error;
    }
};



// Khởi chạy cron job
cron.schedule('0 0 * * *', async () => {
    console.log('Starting data sync job...');
    await connectDB();
    resetJsonServer();
    await syncDataToJsonServer();
    await disconnectDB();
    console.log('Data sync job completed and MongoDB connection closed.');
});
