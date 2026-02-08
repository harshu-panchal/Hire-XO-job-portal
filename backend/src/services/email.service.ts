import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: any;

    constructor() {
        // Initialize transporter with environment variables
        // If not provided, it will log to console (fallback)
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }
    }

    public async sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean> {
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>You requested a password reset for your HireXO account.</p>
                <p>Please click the button below to reset your password. This link is valid for 1 hour.</p>
                <a href="${resetLink}" style="display: inline-block; background-color: #0F172A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
                <p style="color: #64748B; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            </div>
        `;

        if (this.transporter) {
            try {
                await this.transporter.sendMail({
                    from: `"HireXO Support" <${process.env.SMTP_FROM || 'noreply@hirexo.com'}>`,
                    to,
                    subject: 'Reset Your Password',
                    html,
                });
                console.log(`Password reset email sent to ${to}`);
                return true;
            } catch (error) {
                console.error('Failed to send email:', error);
                return false;
            }
        } else {
            console.warn('SMTP not configured. Logging email content to console.');
            if (process.env.NODE_ENV !== 'production') {
                console.log('--- EMAIL SIMULATION ---');
                console.log(`To: ${to}`);
                console.log(`Subject: Reset Your Password`);
                console.log(`Link: ${resetLink}`);
                console.log('------------------------');
            }
            return true; // Return true to allow flow to continue in dev mode
        }
    }
}
