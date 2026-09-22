// -Path: "server/src/api/user/auth/service/auth-token.service.ts"
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';

const SIGNUP_TOKEN_EXPIRES = '15m';
const ACTION_TOKEN_EXPIRES = '15m';

export type TokenPurpose = 'signup' | 'reset' | 'changeEmail' | 'changePassword';

@Injectable()
export class AuthTokenService {
    constructor(private readonly jwtService: JwtService) {}

    /** Sign a purpose-bound token (OTP verification, account changes). */
    sign(userId: string, purpose: TokenPurpose, extra?: { newEmail?: string }): string {
        return this.jwtService.sign(
            { userId, purpose, ...(extra ?? {}) } as object,
            { expiresIn: purpose === 'signup' ? SIGNUP_TOKEN_EXPIRES : ACTION_TOKEN_EXPIRES },
        );
    }

    /** Verify a purpose-bound token; throws when invalid or used for another purpose. */
    verify(token: string, purpose: TokenPurpose): { userId: string; newEmail?: string } {
        let payload: { userId?: string; purpose?: string; newEmail?: string };
        try {
            payload = this.jwtService.verify(token);
        } catch {
            throw new BadRequestException('INVALID_OTP');
        }
        if (!payload?.userId || payload.purpose !== purpose)
            throw new BadRequestException('INVALID_OTP');
        return { userId: payload.userId, newEmail: payload.newEmail };
    }

    /** Verify a plain session access token (e.g. to identify the signed-in user). */
    verifySession(token: string): { userId: string } {
        let payload: { userId?: string };
        try {
            payload = this.jwtService.verify(token);
        } catch {
            throw new BadRequestException('INVALID_SESSION');
        }
        if (!payload?.userId) throw new BadRequestException('INVALID_SESSION');
        return { userId: payload.userId };
    }
}