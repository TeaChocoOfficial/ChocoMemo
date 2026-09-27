// -Path: "src/user/auth/strategies/x.strategy.ts"
import { Role } from '~/types/auth';
import { AuthProvider } from '~/types/auth';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SecureService } from '~/secure/secure.service';
import type { UserType } from '../../dto/create-user.dto';
import type { AuthIdentity } from '../schemas/auth-identity.schema';
import { CookieOAuth2StateStore } from '../../utils/oauth2-state.store';
import { Strategy, type Profile } from '@superfaceai/passport-twitter-oauth2';

@Injectable()
export class XStrategy extends PassportStrategy(Strategy, 'x') {
    private static isConfigured = false;
    private readonly logger = new Logger(XStrategy.name);

    constructor(readonly secureService: SecureService) {
        const { X_CLIENT_ID, X_CLIENT_SECRET, X_CALLBACK_URL } = secureService.getEnvConfig();

        // Fail fast at boot: missing credentials would otherwise surface as an
        // opaque 500 the first time somebody clicked "Sign in with X".
        if (!X_CLIENT_ID || !X_CLIENT_SECRET || !X_CALLBACK_URL) {
            throw new Error(
                'X OAuth is not configured: set X_CLIENT_ID, X_CLIENT_SECRET and X_CALLBACK_URL.',
            );
        }

        super({
            clientID: X_CLIENT_ID,
            clientSecret: X_CLIENT_SECRET,
            callbackURL: X_CALLBACK_URL,
            // ⚠️ X บังคับ 'confidential' สำหรับ Web App (server-side)
            clientType: 'confidential',
            // ⚠️ users.email ต้องขอเพื่อให้ได้ email
            scope: ['tweet.read', 'users.read', 'users.email', 'offline.access'],
            passReqToCallback: false,
            // `@types/passport-oauth2` types `store` as a 2/3-argument state
            // store, but the runtime dispatches on `store.length` and only the
            // 5-argument call receives the PKCE verifier this provider requires.
            store: new CookieOAuth2StateStore() as unknown as ConstructorParameters<
                typeof Strategy
            >[0]['store'],
        });
        XStrategy.isConfigured = true;

        this.logger.log('X Strategy initialized successfully');
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any) => void,
    ): Promise<Omit<UserType, 'nameTag'>> {
        if (!XStrategy.isConfigured) {
            const error = new Error('X Sign-in is not configured');
            this.logger.error(error.message);
            done(error, null as any);
            throw error;
        }

        this.logger.debug('X strategy validate called');

        // X OAuth 2.0 profile: { id, username, displayName, photos, emails }
        const { id, username, displayName, photos, emails } = profile;

        const avatar = photos?.[0]?.value;
        const email = emails?.[0]?.value ?? null;

        const authIdentity: AuthIdentity = {
            provider: AuthProvider.X,
            providerUserId: id,
            providerEmail: email,
            passwordHash: null,
            avatar,
        };

        const user: Omit<UserType, 'nameTag'> = {
            name: displayName || username || 'X User',
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
        return XStrategy.isConfigured;
    }
}
