import mongoose from 'mongoose';

const atmosphereSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, enum: ['lonely', 'nostalgic', 'calm', 'hopeful', 'chaotic', 'dreamy'], required: true },
    note: { type: String },
}, { timestamps: true });

export const Atmosphere = mongoose.model('Atmosphere', atmosphereSchema);