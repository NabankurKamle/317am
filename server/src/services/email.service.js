import MailComposer from 'nodemailer/lib/mail-composer/index.js';
import { gmail } from '../config/email.js';
import { ENV } from '../config/env.js';

// ── Helper: build raw base64url MIME message ──────────────────────────────────
const buildRawMessage = (mailOptions) =>
  new Promise((resolve, reject) => {
    const mail = new MailComposer(mailOptions);
    mail.compile().build((err, message) => {
      if (err) return reject(err);
      const raw = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      resolve(raw);
    });
  });

// ── Helper: send via Gmail REST API (HTTPS port 443 — never blocked) ──────────
const sendViaGmailAPI = async (mailOptions) => {
  const raw = await buildRawMessage(mailOptions);
  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });
  return res.data;
};

// ── Base HTML template ────────────────────────────────────────────────────────
const baseTemplate = ({ title, preheader, body, cta, ctaUrl }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#070816;font-family:'DM Sans',Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070816;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
          <tr>
            <td style="height:2px;background:linear-gradient(90deg,transparent,#8B5CF6,#EC4899,transparent);"></td>
          </tr>
          <tr>
            <td style="padding:32px 36px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;color:rgba(255,255,255,0.3);font-size:11px;letter-spacing:0.35em;text-transform:uppercase;">3:17 AM</p>
              <h1 style="margin:8px 0 0;color:rgba(245,243,255,0.85);font-size:26px;font-weight:400;line-height:1.2;">${title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px;">${body}</td>
          </tr>
          ${cta ? `
          <tr>
            <td style="padding:0 36px 32px;">
              <a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;background:rgba(139,92,246,0.2);border:1px solid rgba(139,92,246,0.5);border-radius:12px;color:#A78BFA;text-decoration:none;font-size:14px;">
                ${cta}
              </a>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px;line-height:1.6;">
                You're receiving this because you have an account at 3:17 AM.<br/>
                <a href="${ENV.CLIENT_URL}" style="color:rgba(139,92,246,0.6);text-decoration:none;">Visit your archive</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ── Capsule unlock email ───────────────────────────────────────────────────────
export const sendCapsuleUnlockEmail = async ({
  to, username, capsuleTitle, capsuleContent,
}) => {
  const preview = capsuleContent.length > 200
    ? capsuleContent.slice(0, 200).trimEnd() + '…'
    : capsuleContent;

  return sendViaGmailAPI({
    from: `"3:17 AM" <${ENV.EMAIL_FROM}>`,
    to,
    subject: `Your capsule opened — "${capsuleTitle || 'A message from your past'}"`,
    html: baseTemplate({
      title: 'Your time capsule has opened.',
      preheader: `"${capsuleTitle || 'A message from your past'}" is ready to read.`,
      body: `
        <p style="margin:0 0 16px;color:rgba(245,243,255,0.6);font-size:15px;line-height:1.7;">Hey ${username},</p>
        <p style="margin:0 0 24px;color:rgba(245,243,255,0.6);font-size:15px;line-height:1.7;">A message you sealed for yourself is now open.</p>
        <div style="background:rgba(125,211,252,0.06);border:1px solid rgba(125,211,252,0.2);border-radius:14px;padding:20px 24px;margin-bottom:24px;">
          <p style="margin:0 0 8px;color:rgba(125,211,252,0.7);font-size:11px;letter-spacing:0.3em;text-transform:uppercase;">⟁ Unsealed</p>
          <p style="margin:0 0 12px;color:rgba(245,243,255,0.8);font-size:18px;font-weight:400;">${capsuleTitle || 'Unnamed Capsule'}</p>
          <p style="margin:0;color:rgba(245,243,255,0.45);font-size:14px;line-height:1.7;font-style:italic;">"${preview}"</p>
        </div>
        <p style="margin:0;color:rgba(245,243,255,0.35);font-size:13px;">Open your archive to read the full message.</p>
      `,
      cta: 'Open Your Capsule',
      ctaUrl: `${ENV.CLIENT_URL}/capsules`,
    }),
    text: `Hey ${username}, your capsule "${capsuleTitle}" has opened. Visit ${ENV.CLIENT_URL}/capsules`,
  });
};

// ── Welcome email ─────────────────────────────────────────────────────────────
export const sendWelcomeEmail = async ({ to, username }) => {
  return sendViaGmailAPI({
    from: `"3:17 AM" <${ENV.EMAIL_FROM}>`,
    to,
    subject: 'Your archive is ready.',
    html: baseTemplate({
      title: `Welcome to the archive, ${username}.`,
      preheader: 'Some thoughts only exist at night.',
      body: `
        <p style="margin:0 0 16px;color:rgba(245,243,255,0.6);font-size:15px;line-height:1.7;">Your midnight archive is ready.</p>
        <p style="margin:0 0 24px;color:rgba(245,243,255,0.6);font-size:15px;line-height:1.7;">Leave fragments. Write echoes. Seal time capsules. Log how the night feels.</p>
        <p style="margin:0;color:rgba(245,243,255,0.3);font-size:13px;">Some thoughts only exist at night.</p>
      `,
      cta: 'Enter Your Archive',
      ctaUrl: `${ENV.CLIENT_URL}/tonight`,
    }),
    text: `Welcome to 3:17 AM, ${username}. Visit ${ENV.CLIENT_URL}/tonight`,
  });
};