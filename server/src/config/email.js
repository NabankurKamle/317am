import nodemailer from 'nodemailer';
import { ENV } from './env.js';

const createTransport = () => {
    switch (ENV.EMAIL_PROVIDER) {

        case 'gmail':
            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: ENV.EMAIL_USER,
                    pass: ENV.EMAIL_PASS,       // must be a Gmail App Password
                },
            });

        case 'resend':
            return nodemailer.createTransport({
                host: 'smtp.resend.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'resend',
                    pass: ENV.RESEND_API_KEY,
                },
            });

        case 'smtp':
        default:
            return nodemailer.createTransport({
                host: ENV.SMTP_HOST,
                port: parseInt(ENV.SMTP_PORT) || 587,
                secure: ENV.SMTP_PORT === '465',
                auth: {
                    user: ENV.SMTP_USER,
                    pass: ENV.SMTP_PASS,
                },
            });
    }
};

export const transporter = createTransport();

// Verify connection on startup (non-blocking)
transporter.verify().then(() => {
    console.log('📬 Email transport ready');
}).catch(err => {
    console.warn('⚠️  Email transport not configured:', err.message);
});