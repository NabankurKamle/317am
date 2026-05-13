import mongoose from 'mongoose';

const fragmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled Fragment' },
    content: { type: String, required: true },
    mood: { type: String, enum: ['lonely', 'nostalgic', 'calm', 'hopeful', 'chaotic', 'dreamy'], default: 'calm' },
    glowColor: { type: String, default: '#8B5CF6' },
    song: { type: String },
    tags: [{ type: String }],
}, { timestamps: true });

export const Fragment = mongoose.model('Fragment', fragmentSchema);