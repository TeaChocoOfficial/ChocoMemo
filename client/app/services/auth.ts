// -Path: 'client/app/services/auth.ts'
import { z } from 'zod';
import env from '~/secure/env';
import type { User } from '~/types/auth';
import serverRest, { schemaParse } from './axios';

const email = z.string().trim().email();

/** Payload for the password sign-in endpoint. */
export const loginPayloadSchema = z.object({
    email,
    password: z.string().min(1),
});
export type LoginPayload = z.infer<typeof loginPayloadSchema>;

/** Payload for the registration endpoint. */
export const registerPayloadSchema = z.object({
    name: z.string().trim().min(1),
    email,
    password: z.string().min(1),
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
});
export type ResendOtpPayload = z.infer<typeof resendOtpPayloadSchema>;

/** Payload for requesting a password reset OTP. */
export const forgotPasswordPayloadSchema = z.object({
    email,
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
    email: email.optional(),
    avatar: z.string().min(1).optional(),
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

export const authAPI = {
    auth: () => schemaParse(userResponseSchema, serverRest.get('/user/auth')),
    login: (data: LoginPayload) => {
        const payload = loginPayloadSchema.parse(data);
        return schemaParse(signinResultSchema, serverRest.post('/user/auth/login', payload));
    },
    register: (data: RegisterPayload) => {
        const payload = registerPayloadSchema.parse(data);
        return schemaParse(signinResultSchema, serverRest.post('/user/auth/register', payload));
    },
    verifyOtp: (data: VerifyOtpPayload) => {
        const payload = verifyOtpPayloadSchema.parse(data);
        return schemaParse(signinResultSchema, serverRest.post('/user/auth/verify-otp', payload));
    },
    resendOtp: (data: ResendOtpPayload) => {
        const payload = resendOtpPayloadSchema.parse(data);
        return schemaParse(signinResultSchema, serverRest.post('/user/auth/resend-otp', payload));
    },
    forgotPassword: (data: ForgotPasswordPayload) => {
        const payload = forgotPasswordPayloadSchema.parse(data);
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
    googleLogin: () => {
        const redirectUri = `${window.location.origin}${env.BASE}auth`;
        window.location.href = `${env.API_URL}/api/user/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
    },
    updateUser: (data: UpdateUserPayload) => {
        const payload = updateUserPayloadSchema.parse(data);
        return schemaParse(userField, serverRest.put('/user/auth', payload));
    },
    changePassword: (data: ChangePasswordPayload) => {
        const payload = changePasswordPayloadSchema.parse(data);
        return serverRest.post('/user/auth/change-password', payload);
    },
    updateAvatar: (data: UpdateAvatarPayload) => {
        const payload = updateAvatarPayloadSchema.parse(data);
        return schemaParse(userField, serverRest.put('/user/auth/avatar', payload));
    },
};
