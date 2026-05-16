export const ENV = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CLIENT_URL: process.env.CLIENT_URL || 'https://317am.vercel.app/',
    COOKIE_NAME: process.env.COOKIE_NAME || '317am_session',
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    EMAIL_FROM: process.env.EMAIL_FROM || '317am.archive@gmail.com',
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
};