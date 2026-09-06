// -Path: 'src/user/auth/strategies/google.strategy.ts'
import { Role } from '../../../../types/auth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import type { UserType } from '../../dto/create-user.dto';
import { SecureService } from '../../../../secure/secure.service';
import { Strategy, type VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private static isConfigured = false;
    private readonly logger = new Logger(GoogleStrategy.name);

    constructor(readonly secureService: SecureService) {
        const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
            secureService.getEnvConfig();

        const hasRequiredConfig = !!(
            GOOGLE_CLIENT_ID &&
            GOOGLE_CLIENT_SECRET &&
            GOOGLE_CALLBACK_URL
        );

        if (!hasRequiredConfig) {
            GoogleStrategy.isConfigured = false;
            super({
                clientID: 'dummy',
                clientSecret: 'dummy',
                callbackURL: 'http://localhost:3000/dummy',
                scope: ['email', 'profile'],
            });
            GoogleStrategy.isConfigured = false;
            return;
        }

        GoogleStrategy.isConfigured = true;
        super({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
            passReqToCallback: false,
        });

        this.logger.log('Google Strategy initialized successfully');
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<UserType> {
        if (!GoogleStrategy.isConfigured) {
            const error = new Error('Google Sign-in is not configured');
            this.logger.error(error.message);
            done(error, null as any);
            throw error;
        }

        this.logger.debug('Google strategy validate called');
        const { id, displayName, emails, photos, _json } = profile;

        const user: UserType = {
            googleId: id,
            email: emails[0].value,
            name: displayName,
            avatar: photos[0]?.value ?? _json?.avatar ?? '',
            role: Role.USER,
            expiresAt: Date.now() + 3600 * 1000,
            lastLoginAt: Date.now(),
            accessToken,
            refreshToken,
        };

        done(null, user);
        return user;
    }

    static isEnabled(): boolean {
        return GoogleStrategy.isConfigured;
    }
}
