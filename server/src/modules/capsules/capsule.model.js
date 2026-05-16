import mongoose from 'mongoose';

const capsuleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        trim: true,
        default: 'Unnamed Capsule',
        maxlength: 100,
    },
    content: {
        type: String,
        required: [true, 'Capsule content is required.'],
        maxlength: 10000,
    },
    unlockAt: {
        type: Date,
        required: [true, 'Unlock date is required.'],
    },
    timezone: {
        type: String,
        default: 'UTC',
    },
    isUnlocked: {
        type: Boolean,
        default: false,
    },
    mood: {
        type: String,
        enum: ['lonely', 'nostalgic', 'calm', 'hopeful', 'chaotic', 'dreamy'],
    },
    song: {
        type: String,
        maxlength: 200,
    },
}, { timestamps: true });

export const Capsule = mongoose.model('Capsule', capsuleSchema);