import { Echo } from './echo.model.js';

export const getUserEchoes = (userId) =>
    Echo.find({ user: userId }).sort({ createdAt: -1 });

export const createEcho = (userId, data) =>
    Echo.create({ user: userId, ...data });

export const deleteEcho = async (id, userId) => {
    const result = await Echo.findOneAndDelete({ _id: id, user: userId });
    if (!result) throw Object.assign(new Error('Echo not found.'), { status: 404 });
    return result;
};

export const getEchoById = async (id, userId) => {
    const echo = await Echo.findOne({ _id: id, user: userId });
    if (!echo) throw Object.assign(new Error('Echo not found.'), { status: 404 });
    return echo;
};