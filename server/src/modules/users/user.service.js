import { User } from './user.model.js';

export const getUserById = async (id) => {
    const user = await User.findById(id).select('-password');
    if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
    return user;
};

export const updateUser = async (id, updates) => {
    // Prevent password update through this service — use dedicated change-password flow
    const { password, ...safeUpdates } = updates;

    const user = await User.findByIdAndUpdate(
        id,
        { $set: safeUpdates },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
    return user;
};

export const updateMood = async (id, mood) => {
    const user = await User.findByIdAndUpdate(
        id,
        { $set: { currentMood: mood } },
        { new: true }
    ).select('-password');

    if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
    return user;
};

export const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
    return { deleted: true };
};