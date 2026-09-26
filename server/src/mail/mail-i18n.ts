// Mail copy localisation. The client sends its UI locale with every
// email-triggering request (see the `locale` field on RegisterDto,
// ResendOtpDto and ForgotPasswordDto); this module turns that arbitrary
// string into one of the catalogues in `mail.messages.json`.
//
// English is the guaranteed fallback: an unknown, malformed or missing
// locale must never stop an OTP from being delivered.
import messages from './mail.messages.json';

export const MAIL_LOCALES = Object.keys(messages) as MailLocale[];
export type MailLocale = keyof typeof messages;

export const DEFAULT_MAIL_LOCALE: MailLocale = 'en-US';

export type MailTemplateKind = 'otp' | 'passwordReset';
export type MailTemplate = (typeof messages)[MailLocale][MailTemplateKind];

/**
 * Resolve a client locale string to a supported mail locale.
 *
 * Accepts the exact catalogue codes (`th-TH`) as well as bare language
 * subtags (`th`, `TH`) and odd casing, since the value arrives from a
 * browser. Falls back to English.
 */
export function resolveMailLocale(input?: string | null): MailLocale {
    if (typeof input !== 'string') return DEFAULT_MAIL_LOCALE;

    const tag = input.trim();
    if (!tag) return DEFAULT_MAIL_LOCALE;

    const lower = tag.toLowerCase();

    // 1. Exact match, case-insensitively.
    const exact = MAIL_LOCALES.find((locale) => locale.toLowerCase() === lower);
    if (exact) return exact;

    // 2. Match on the primary language subtag, e.g. `th` -> `th-TH`.
    const base = lower.split(/[-_]/)[0];
    const byLanguage = MAIL_LOCALES.find((locale) => locale.toLowerCase().split('-')[0] === base);
    if (byLanguage) return byLanguage;

    return DEFAULT_MAIL_LOCALE;
}

/** Pick one mail template, resolved for `locale` with an English fallback. */
export function getMailTemplate(
    kind: MailTemplateKind,
    locale?: string | null,
): { locale: MailLocale; copy: MailTemplate } {
    const resolved = resolveMailLocale(locale);
    return { locale: resolved, copy: messages[resolved][kind] };
}
