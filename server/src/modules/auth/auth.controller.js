import * as authService from './auth.service.js';
import { User } from '../users/user.model.js';
import { ENV } from '../../config/env.js';
import { cookieOptions } from '../../config/cookie.js';
import { sendWelcomeEmail } from '../../services/email.service.js';   // ← add

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ message: 'All fields are required.' });

        const { user, token } = await authService.registerUser({ username, email, password });

        res.cookie(ENV.COOKIE_NAME, token, cookieOptions);

        // Send welcome email — non-blocking, don't await
        sendWelcomeEmail({ to: user.email, username: user.username }).catch(err =>
            console.warn('Welcome email failed:', err.message)
        );

        return res.status(201).json({
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password required.' });

        const { user, token } = await authService.loginUser({ email, password });
        res.cookie(ENV.COOKIE_NAME, token, cookieOptions);

        return res.json({
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (err) { next(err); }
};

export const logout = async (req, res) => {
    res.clearCookie(ENV.COOKIE_NAME, { path: '/' });
    return res.json({ message: 'The night is over.' });
};

export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        return res.json(user);
    } catch (err) { next(err); }
};