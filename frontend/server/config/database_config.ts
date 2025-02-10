import mongoose from "mongoose";
import dotenv from 'dotenv';
import { envPath } from '../utils/env_paht.js';

dotenv.config({ path: envPath });

const MONGO_URI = process.env.MONGO_URI;
console.log('MONGO_URI:', process.env.MONGO_URI);

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}

export const connectDB = async (): Promise<typeof mongoose> => {
    try {
        const db = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected to ${db.connection.name} database`);
        return db;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};