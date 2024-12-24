import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.DATABASE_URI);

export const connectDB = async (): Promise<mongoose.Connection> => {
    try {
        await mongoose.connect(String(process.env.DATABASE_URI));
        console.log("Connected to database");
        return mongoose.connection;
    } catch (error) {
        console.error("Error connecting to database: ", error);
        process.exit(1);
    }
};

export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected successfully!");
    } catch (error) {
        console.error("Error disconnecting from database: ", error);
    }
};