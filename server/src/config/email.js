import { google } from 'googleapis';
import { ENV } from './env.js';

// ── OAuth2 client ─────────────────────────────────────────────────────────────
const oauth2Client = new google.auth.OAuth2(
    ENV.GMAIL_CLIENT_ID,
    ENV.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: ENV.GMAIL_REFRESH_TOKEN,
});

// ── Gmail API client ──────────────────────────────────────────────────────────
// This sends over HTTPS port 443 — never touches SMTP ports 465/587
export const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Verify on startup — just checks the token, no TCP connection
oauth2Client.getAccessToken()
    .then(() => console.log('📬 Gmail API transport ready'))
    .catch(err => console.warn('⚠️  Email transport not configured:', err.message));