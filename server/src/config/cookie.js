import { ENV } from './env.js';

export const cookieOptions = {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: ENV.COOKIE_MAX_AGE,
    path: '/',
};