import { DateTime } from 'luxon';
import { Capsule } from './capsule.model.js';
import {
    scheduleCapsuleUnlock,
    cancelCapsuleUnlock,
} from '../../jobs/definitions/capsuleUnlock.job.js';

const toUTCMidnight = (dateStr, timezone) => {
    const tz = timezone || 'UTC';
    const dt = DateTime.fromISO(`${dateStr}T00:00:00`, { zone: tz });

    if (!dt.isValid) {
        throw Object.assign(
            new Error(`Invalid date or timezone: ${dateStr} / ${tz}`),
            { status: 400 }
        );
    }

    return dt.toJSDate();
};

// ── Service methods ───────────────────────────────────────────────────────────

export const getUserCapsules = (userId) =>
    Capsule.find({ user: userId }).sort({ createdAt: -1 });

export const createCapsule = async (userId, data) => {
    const unlockAtUTC = toUTCMidnight(data.unlockAt, data.timezone);

    if (unlockAtUTC <= new Date()) {
        throw Object.assign(
            new Error('Unlock date must be in the future.'),
            { status: 400 }
        );
    }

    const capsule = await Capsule.create({
        user: userId,
        title: data.title,
        content: data.content,
        unlockAt: unlockAtUTC,
        timezone: data.timezone || 'UTC',
        mood: data.mood,
        song: data.song,
        isUnlocked: false,
    });

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