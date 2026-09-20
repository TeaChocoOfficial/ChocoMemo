// -Path: "src/mail/mail.service.ts"
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { SecureService } from '../secure/secure.service';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private readonly transporter: Transporter;

    constructor(private readonly secureService: SecureService) {
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = this.secureService.getEnvConfig();
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: Number(SMTP_PORT) === 465,
            auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
        });
    }

    async sendOtp(to: string, code: string): Promise<void> {
        const { SMTP_FROM } = this.secureService.getEnvConfig();
        await this.transporter.sendMail({
            to,
            from: SMTP_FROM,
            subject: 'Your ChocoMemo verification code',
            text: `Your verification code is ${code}. It expires in 10 minutes.`,
            html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                    <h2 style="margin-bottom: 8px;">ChocoMemo</h2>
                    <p>Your verification code is:</p>
                    <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px;">${code}</p>
                    <p style="color: #666;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        });
    }

    async sendPasswordReset(to: string, code: string): Promise<void> {
        const { SMTP_FROM } = this.secureService.getEnvConfig();
        await this.transporter.sendMail({
            to,
            from: SMTP_FROM,
            subject: 'Reset your ChocoMemo password',
            text: `Your password reset code is ${code}. It expires in 10 minutes.`,
            html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                    <h2 style="margin-bottom: 8px;">ChocoMemo</h2>
                    <p>We received a request to reset your password. Your reset code is:</p>
                    <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px;">${code}</p>
                    <p style="color: #666;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        });
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            this.logger.error('SMTP connection verification failed', error);
            return false;
        }
    }
}