import { Atmosphere } from './atmosphere.model.js';

export const logMood = (userId, data) =>
    Atmosphere.create({ user: userId, ...data });

export const getMoodHistory = (userId, limit = 30) =>
    Atmosphere.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit);

export const getMoodStats = async (userId) => {
    const history = await Atmosphere.find({ user: userId });

    const counts = history.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
    }, {});

    const topMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

    return {
        total: history.length,
        counts,
        topMood: topMood ? { mood: topMood[0], count: topMood[1] } : null,
    };
};