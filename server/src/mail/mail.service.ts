// -Path: "src/mail/mail.service.ts"
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { SecureService } from '../secure/secure.service';
import { getMailTemplate, type MailTemplate } from './mail-i18n';

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

    /**
     * Build the plain-text and HTML bodies for one message.
     * `code` is always server-generated digits, never user input.
     */
    private render(copy: MailTemplate, code: string): { text: string; html: string } {
        return {
            text: `${copy.intro}\n\n${code}\n\n${copy.footer}`,
            html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                    <h2 style="margin-bottom: 8px;">${copy.heading}</h2>
                    <p>${copy.intro}</p>
                    <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px;">${code}</p>
                    <p style="color: #666;">${copy.footer}</p>
                </div>
            `,
        };
    }

    /** `locale` is the client's UI locale; unknown values fall back to English. */
    async sendOtp(to: string, code: string, locale?: string | null): Promise<void> {
        const { SMTP_FROM } = this.secureService.getEnvConfig();
        const { copy } = getMailTemplate('otp', locale);
        const { text, html } = this.render(copy, code);

        await this.transporter.sendMail({
            to,
            from: SMTP_FROM,
            subject: copy.subject,
            text,
            html,
        });
    }

    /** `locale` is the client's UI locale; unknown values fall back to English. */
    async sendPasswordReset(to: string, code: string, locale?: string | null): Promise<void> {
        const { SMTP_FROM } = this.secureService.getEnvConfig();
        const { copy } = getMailTemplate('passwordReset', locale);
        const { text, html } = this.render(copy, code);

        await this.transporter.sendMail({
            to,
            from: SMTP_FROM,
            subject: copy.subject,
            text,
            html,
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
