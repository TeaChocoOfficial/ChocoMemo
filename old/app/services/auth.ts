// -Path: 'client/app/services/auth.ts'
import { z } from 'zod';
import env from '~/secure/env';
import type { User } from '~/types/auth';
import serverRest, { schemaParse } from './axios';
import { getLocaleUrl } from '~/utils/url';

const email = z.string().trim().email();

/** UI locale, so the server can send its email in the user's language.
 *  Loose BCP-47 shape; the server maps it to a catalogue and falls back
 *  to en-US, so this only rejects values that cannot be a language tag. */
const locale = z
    .string()
    .trim()
    .max(35)
    .regex(/^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/, 'locale: BCP-47 tag, e.g. "en" or "th-TH"')
    .optional();

/** Public handle: English letters/numbers/`_-` only, no spaces, stored lowercase. */
export const nameTagField = z
    .string()
    .trim()
    .toLowerCase()
    .regex(
        /^[A-Za-z0-9_-]{3,30}$/,
        'nameTag: English letters, numbers, "_" or "-" only (no spaces), 3-30 chars',
    );

/** Payload for the password sign-in endpoint. */
export const loginPayloadSchema = z.object({
    email,
    password: z.string().min(1),
});
export type LoginPayload = z.infer<typeof loginPayloadSchema>;

/** Payload for the registration endpoint. */
export const registerPayloadSchema = z.object({
    name: z.string().trim().min(1),
    nameTag: nameTagField,
    email,
    password: z.string().min(1),
    locale,
});
export type RegisterPayload = z.infer<typeof registerPayloadSchema>;

/** Payload for the OTP verification endpoint. */
export const verifyOtpPayloadSchema = z.object({
    token: z.string().min(1),
    code: z.string().trim().length(6),
});
export type VerifyOtpPayload = z.infer<typeof verifyOtpPayloadSchema>;

/** Payload for the OTP resend endpoint. */
export const resendOtpPayloadSchema = z.object({
    email,
    locale,
});
export type ResendOtpPayload = z.infer<typeof resendOtpPayloadSchema>;

/** Payload for requesting a password reset OTP. */
export const forgotPasswordPayloadSchema = z.object({
    email,
    locale,
});
export type ForgotPasswordPayload = z.infer<typeof forgotPasswordPayloadSchema>;

/** Payload for confirming a reset OTP and setting a new password. */
export const resetPasswordPayloadSchema = z.object({
    token: z.string().min(1),
    code: z.string().trim().length(6),
    newPassword: z.string().min(6),
});
export type ResetPasswordPayload = z.infer<typeof resetPasswordPayloadSchema>;

/** The `User` shape isn't authored here (server-derived fields like dates),
 *  so it's referenced opaquely and only the nullability is validated. */
const userField = z.custom<User>();

/** Response returned by the request OTP endpoints for account changes. */
const securityTokenSchema = z.object({
    token: z.string(),
});

/** Response shape returned by the sign-in / registration endpoints. */
export const signinResultSchema = z.object({
    message: z.string(),
    access_token: z.string(),
    user: userField.nullable(),
    /** Development only: the verification OTP, exposed so the flow works without SMTP. */
    devOtp: z.string().optional(),
});
export type SigninResult = z.infer<typeof signinResultSchema>;

/** Partial payload accepted by the update-user endpoint. */
export const updateUserPayloadSchema = z.object({
    name: z.string().trim().min(1).optional(),
    avatar: z.string().min(1).optional(),
    nameTag: nameTagField.optional(),
    bio: z.string().trim().max(160).optional(),
});
export type UpdateUserPayload = z.infer<typeof updateUserPayloadSchema>;

/** Payload for the change-password endpoint. */
export const changePasswordPayloadSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
});
export type ChangePasswordPayload = z.infer<typeof changePasswordPayloadSchema>;

/** Payload for the identity-avatar endpoint. */
export const updateAvatarPayloadSchema = z.object({
    provider: z.string().min(1),
    url: z.string().min(1).optional(),
});
export type UpdateAvatarPayload = z.infer<typeof updateAvatarPayloadSchema>;

const userResponseSchema = userField.nullable();

/** The active UI language, read lazily so this module stays import-order safe. */
function currentLocale(): string | undefined {
    const lang = typeof document !== 'undefined' ? document.documentElement.lang : '';
    return lang || undefined;
}

/** Hand the browser off to a provider's OAuth entry point.
 *  The provider redirects back to the server callback, which then forwards
 *  to `path`. The server reads both params back out of HttpOnly cookies, so
 *  nothing sensitive travels in the query string.
 *  `mode=disconnect` re-verifies the account instead of linking it, which is
 *  what authorises unlinking that provider. */
function oauth(provider: string, path: string, mode?: 'disconnect') {
    const redirectUri = getLocaleUrl(path);
    const query = new URLSearchParams({ redirect_uri: redirectUri });
    if (mode) query.set('mode', mode);
    window.location.href = `${env.API_URL}/api/user/auth/${provider}?${query}`;
}

export const authAPI = {
    auth: () => schemaParse(userResponseSchema, serverRest.get<User>('/user/auth')),
    login: (data: LoginPayload) => {
        const payload = loginPayloadSchema.parse(data);
        return schemaParse(signinResultSchema, serverRest.post('/user/auth/login', payload));
    },
    register: (data: RegisterPayload) => {
        const payload = registerPayloadSchema.parse({ ...data, locale: currentLocale() });
        return schemaParse(signinResultSchema, serverRest.post('/user/auth/register', payload));
    },
    verifyOtp: (data: VerifyOtpPayload) => {
        const payload = verifyOtpPayloadSchema.parse(data);
        return schemaParse(signinResultSchema, serverRest.post('/user/auth/verify-otp', payload));
    },
    resendOtp: (data: ResendOtpPayload) => {
        const payload = resendOtpPayloadSchema.parse({ ...data, locale: currentLocale() });
        return schemaParse(signinResultSchema, serverRest.post('/user/auth/resend-otp', payload));
    },
    forgotPassword: (data: ForgotPasswordPayload) => {
        const payload = forgotPasswordPayloadSchema.parse({
            ...data,
            locale: currentLocale(),
        });
        return schemaParse(
            signinResultSchema,
            serverRest.post('/user/auth/forgot-password', payload),
        );
    },
    resetPassword: (data: ResetPasswordPayload) => {
        const payload = resetPasswordPayloadSchema.parse(data);
        return schemaParse(
            signinResultSchema,
            serverRest.post('/user/auth/reset-password', payload),
        );
    },
    logout: () => serverRest.get('/user/auth/signout'),
    googleLogin: (path: string) => oauth('google', path),
    /** Re-verify the linked Google account before unlinking it. */
    googleDisconnect: (path: string) => oauth('google', path, 'disconnect'),
    discordLogin: (path: string) => oauth('discord', path),
    /** Re-verify the linked Discord account before unlinking it. */
    discordDisconnect: (path: string) => oauth('discord', path, 'disconnect'),
    lineLogin: (path: string) => oauth('line', path),
    lineDisconnect: (path: string) => oauth('line', path, 'disconnect'),
    xLogin: (path: string) => oauth('x', path),
    xDisconnect: (path: string) => oauth('x', path, 'disconnect'),
    updateUser: (data: UpdateUserPayload) => {
        const payload = updateUserPayloadSchema.parse(data);
        return schemaParse(userField, serverRest.put('/user/auth', payload));
    },
    changePassword: (data: ChangePasswordPayload) => {
        const payload = changePasswordPayloadSchema.parse(data);
        return serverRest.post('/user/auth/change-password', payload);
    },
    requestEmailChange: (data: { newEmail: string }) => {
        return schemaParse(
            securityTokenSchema,
            serverRest.post('/user/auth/change-email/request', {
                ...data,
                locale: currentLocale(),
            }),
        );
    },
    confirmEmailChange: (data: { token: string; code: string }) => {
        return schemaParse(
            signinResultSchema,
            serverRest.post('/user/auth/change-email/confirm', data),
        );
    },
    requestPasswordChange: (data: { currentPassword?: string }) => {
        return schemaParse(
            securityTokenSchema,
            serverRest.post('/user/auth/change-password/request', {
                ...data,
                locale: currentLocale(),
            }),
        );
    },
    confirmPasswordChange: (data: {
        token: string;
        code: string;
        currentPassword?: string;
        newPassword: string;
    }) => {
        return serverRest.post('/user/auth/change-password/confirm', data);
    },
    updateAvatar: (data: UpdateAvatarPayload) => {
        const payload = updateAvatarPayloadSchema.parse(data);
        return schemaParse(userField, serverRest.put('/user/auth/avatar', payload));
    },
};
