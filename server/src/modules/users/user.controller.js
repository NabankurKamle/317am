import * as userService from './user.service.js';

export const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.json(user);
    } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
    try {
        // Prevent email/username conflicts — check uniqueness if fields are changing
        const user = await userService.updateUser(req.user.id, req.body);
        res.json(user);
    } catch (err) { next(err); }
};

export const updateMood = async (req, res, next) => {
    try {
        const { mood } = req.body;
        if (!mood) return res.status(400).json({ message: 'Mood is required.' });
        const user = await userService.updateMood(req.user.id, mood);
        res.json(user);
    } catch (err) { next(err); }
};

export const deleteAccount = async (req, res, next) => {
    try {
        await userService.deleteUser(req.user.id);
        // Clear session cookie
        res.clearCookie(process.env.COOKIE_NAME || '317am_session', { path: '/' });
        res.json({ message: 'Archive dissolved. The night forgets.' });
    } catch (err) { next(err); }
};