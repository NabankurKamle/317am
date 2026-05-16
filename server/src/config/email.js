import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { ENV } from './env.js';

// ── OAuth2 client ─────────────────────────────────────────────────────────────
const oauth2Client = new google.auth.OAuth2(
    ENV.GMAIL_CLIENT_ID,
    ENV.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'   // must match what you set in console
);

oauth2Client.setCredentials({
    refresh_token: ENV.GMAIL_REFRESH_TOKEN,
});

// ── Build transporter ─────────────────────────────────────────────────────────
export const createTransporter = async () => {
    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;

    if (!accessToken) throw new Error('Could not obtain Gmail access token.');

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: ENV.GMAIL_USER,
            clientId: ENV.GMAIL_CLIENT_ID,
            clientSecret: ENV.GMAIL_CLIENT_SECRET,
            refreshToken: ENV.GMAIL_REFRESH_TOKEN,
            accessToken,
        },
    });
};

// Verify on startup — non-fatal
createTransporter()
    .then(t => t.verify())
    .then(() => console.log('📬 Gmail OAuth2 transport ready'))
    .catch(err => console.warn('⚠️  Email transport not configured:', err.message));