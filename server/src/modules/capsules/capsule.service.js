import { Capsule } from './capsule.model.js';
import { scheduleCapsuleUnlock, cancelCapsuleUnlock } from '../../jobs/definitions/capsuleUnlock.job.js';

export const getUserCapsules = async (userId) => {
    await Capsule.updateMany(
        { user: userId, unlockAt: { $lte: new Date() }, isUnlocked: false },
        { $set: { isUnlocked: true } }
    );
    return Capsule.find({ user: userId }).sort({ createdAt: -1 });
};

export const createCapsule = async (userId, data) => {
    const capsule = await Capsule.create({
        user: userId,
        title: data.title,
        content: data.content,
        unlockAt: new Date(data.unlockAt),
        mood: data.mood,
        song: data.song,
        isUnlocked: false,
    });

    // Schedule unlock email at the exact unlockAt date
    await scheduleCapsuleUnlock(capsule);

    return capsule;
};

export const getCapsuleById = async (id, userId) => {
    const capsule = await Capsule.findOne({ _id: id, user: userId });
    if (!capsule) throw Object.assign(new Error('Capsule not found.'), { status: 404 });
    return capsule;
};

export const updateCapsule = async (id, userId, data) => {
    const capsule = await Capsule.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: data },
        { new: true, runValidators: true }
    );
    if (!capsule) throw Object.assign(new Error('Capsule not found.'), { status: 404 });
    return capsule;
};

export const deleteCapsule = async (id, userId) => {
    const result = await Capsule.findOneAndDelete({ _id: id, user: userId });
    if (!result) throw Object.assign(new Error('Capsule not found.'), { status: 404 });

    // Cancel the scheduled email when the capsule is deleted
    await cancelCapsuleUnlock(id);

    return result;
};

export const getUpcomingCapsules = async (userId, days = 7) => {
    const future = new Date();
    future.setDate(future.getDate() + days);
    return Capsule.find({
        user: userId,
        isUnlocked: false,
        unlockAt: { $lte: future, $gte: new Date() },
    }).sort({ unlockAt: 1 });
};