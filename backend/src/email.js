import nodemailer from 'nodemailer';

const port = Number(process.env.SMTP_PORT || 587);
const emailConfigured = Boolean(
    process.env.SMTP_HOST &&
    Number.isInteger(port) &&
    port > 0 &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.SMTP_FROM
);

const transporter = emailConfigured
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })
    : null;

export function isEmailConfigured() {
    return emailConfigured;
}

export async function sendPasswordResetEmail(email, resetUrl) {
    if (!transporter) {
        throw new Error('SMTP não está configurado.');
    }

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Redefinição de senha',
        text: `Use este link para redefinir sua senha. Ele expira em 60 minutos:\n\n${resetUrl}\n\nSe você não solicitou a redefinição, ignore esta mensagem.`,
        html: `<p>Use o link abaixo para redefinir sua senha. Ele expira em 60 minutos.</p><p><a href="${resetUrl}">Redefinir senha</a></p><p>Se você não solicitou a redefinição, ignore esta mensagem.</p>`
    });
}
