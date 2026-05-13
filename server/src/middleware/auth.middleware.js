import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const protect = (req, res, next) => {
    // Check cookie first, fall back to Authorization header (for API clients)
    const token =
        req.cookies?.[ENV.COOKIE_NAME] ||
        req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Not authorized — no session found.' });

    try {
        req.user = jwt.verify(token, ENV.JWT_SECRET);

        next();
    } catch {
        // Clear stale cookie
        res.clearCookie(ENV.COOKIE_NAME, { path: '/' });
        res.status(401).json({ message: 'Session expired. Come back to the night.' });
    }
};