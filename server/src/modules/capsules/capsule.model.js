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

// Virtual — auto-compute unlock status without storing redundantly
capsuleSchema.virtual('canOpen').get(function () {
    return new Date() >= this.unlockAt;
});

// Auto-unlock when fetched if date has passed
capsuleSchema.pre('find', function () {
    // Update unlocked status in background (non-blocking)
    this.model.updateMany(
        { unlockAt: { $lte: new Date() }, isUnlocked: false },
        { $set: { isUnlocked: true } }
    ).catch(() => { });
});

export const Capsule = mongoose.model('Capsule', capsuleSchema);