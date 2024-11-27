import mongoose from "mongoose";
import dotenv from 'dotenv';
import { log } from "console";
dotenv.config();
console.log(process.env.DATABASE_URI);
export async function connectDB() {
    try {
        await mongoose.connect(String(process.env.DATABASE_URI));
        console.log("Connected to database");

        return mongoose.connection; // Trả về kết nối để dùng tiếp
    } catch (error) {
        console.error("Error connecting to database: ", error);
        process.exit(1);
    }
}

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected successfully!");
    } catch (error) {
        console.error("Error disconnecting from database: ", error);
    }
}