import mongoose from 'mongoose';

const echoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: String, default: 'Someone' },
    subject: { type: String },
    content: { type: String, required: true },
    mood: { type: String, enum: ['lonely', 'nostalgic', 'calm', 'hopeful', 'chaotic', 'dreamy'] },
}, { timestamps: true });

export const Echo = mongoose.model('Echo', echoSchema);