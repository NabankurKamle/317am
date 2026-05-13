import { Fragment } from './fragment.model.js';

export const getUserFragments = (userId) =>
    Fragment.find({ user: userId }).sort({ createdAt: -1 });

export const createFragment = (userId, data) =>
    Fragment.create({ user: userId, ...data });

export const updateFragment = async (id, userId, data) => {
    const fragment = await Fragment.findOneAndUpdate(
        { _id: id, user: userId }, data, { new: true }
    );
    if (!fragment) throw Object.assign(new Error('Fragment not found'), { status: 404 });
    return fragment;
};

export const deleteFragment = async (id, userId) => {
    const result = await Fragment.findOneAndDelete({ _id: id, user: userId });
    if (!result) throw Object.assign(new Error('Fragment not found'), { status: 404 });
};