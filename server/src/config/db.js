import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log('🌙 MongoDB connected — 317am is awake');
    } catch (err) {
        console.error('DB connection failed:', err.message);
        process.exit(1);
    }
};