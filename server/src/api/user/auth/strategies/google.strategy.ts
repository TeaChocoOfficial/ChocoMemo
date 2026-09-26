// -Path: 'src/user/auth/strategies/google.strategy.ts'
import { Role } from '~/types/auth';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SecureService } from '~/secure/secure.service';
import { AuthProvider } from '../enum/auth-provider.enum';
import type { UserType } from '../../dto/create-user.dto';
import type { AuthIdentity } from '../schemas/auth-identity.schema';
import { Strategy, type VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private static isConfigured = false;
    private readonly logger = new Logger(GoogleStrategy.name);

    constructor(readonly secureService: SecureService) {
        const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
            secureService.getEnvConfig();

        // Fail fast at boot rather than accepting a dummy strategy: a missing
        // credential would otherwise only surface as an opaque 500 the first
        // time somebody clicked "Sign in with Google". `throw` before `super()`
        // is legal — it terminates the constructor.
        if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
            throw new Error(
                'Google OAuth is not configured: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_CALLBACK_URL.',
            );
        }

        super({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
            passReqToCallback: false,
        });
        GoogleStrategy.isConfigured = true;

        this.logger.log('Google Strategy initialized successfully');
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<Omit<UserType, 'nameTag'>> {
        if (!GoogleStrategy.isConfigured) {
            const error = new Error('Google Sign-in is not configured');
            this.logger.error(error.message);
            done(error, null as any);
            throw error;
        }

        this.logger.debug('Google strategy validate called');
        const { id, displayName, emails, photos, _json } = profile;
        const avatar = photos[0]?.value ?? _json?.avatar ?? '';

        const authIdentity: AuthIdentity = {
            provider: AuthProvider.GOOGLE,
            providerUserId: id,
            providerEmail: emails[0].value,
            passwordHash: null,
            avatar,
        };

        const user: Omit<UserType, 'nameTag'> = {
            name: displayName,
            avatar,
            role: Role.USER,
            expiresAt: Date.now() + 3600 * 1000,
            lastLoginAt: Date.now(),
            accessToken,
            refreshToken,
            identities: [authIdentity],
        };

        done(null, user);
        return user;
    }

    static isEnabled(): boolean {
        return GoogleStrategy.isConfigured;
    }
}
