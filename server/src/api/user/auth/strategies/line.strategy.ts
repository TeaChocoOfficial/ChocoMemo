// -Path: "src/user/auth/strategies/line.strategy.ts"
import { Role } from '~/types/auth';
import { AuthProvider } from '~/types/auth';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile } from 'passport-line';
import { SecureService } from '~/secure/secure.service';
import type { UserType } from '../../dto/create-user.dto';
import type { AuthIdentity } from '../schemas/auth-identity.schema';
import { CookieOAuth2StateStore } from '../../utils/oauth2-state.store';

@Injectable()
export class LineStrategy extends PassportStrategy(Strategy, 'line') {
    private static isConfigured = false;
    private readonly logger = new Logger(LineStrategy.name);

    constructor(readonly secureService: SecureService) {
        const { LINE_CHANNEL_ID, LINE_CHANNEL_SECRET, LINE_CALLBACK_URL } =
            secureService.getEnvConfig();

        // Fail fast at boot: missing credentials would otherwise surface as an
        // opaque 500 the first time somebody clicked "Sign in with LINE".
        if (!LINE_CHANNEL_ID || !LINE_CHANNEL_SECRET || !LINE_CALLBACK_URL) {
            throw new Error(
                'LINE OAuth is not configured: set LINE_CHANNEL_ID, LINE_CHANNEL_SECRET and LINE_CALLBACK_URL.',
            );
        }

        super({
            channelID: LINE_CHANNEL_ID,
            channelSecret: LINE_CHANNEL_SECRET,
            callbackURL: LINE_CALLBACK_URL,
            // Space-delimited, not an array: `@types/passport-line` types
            // `scope` as a single string. `passport-oauth2` accepts either and
            // joins an array with the same separator, so the wire format is
            // identical either way.
            scope: 'profile openid',
            passReqToCallback: false,
            // `@types/passport-oauth2` types `store` as a 2/3-argument state
            // store, but the runtime dispatches on `store.length` and only the
            // 5-argument call receives the values this store must persist.
            store: new CookieOAuth2StateStore() as unknown as ConstructorParameters<
                typeof Strategy
            >[0]['store'],
        });
        LineStrategy.isConfigured = true;

        this.logger.log('LINE Strategy initialized successfully');
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any) => void,
    ): Promise<Omit<UserType, 'nameTag'>> {
        if (!LineStrategy.isConfigured) {
            const error = new Error('LINE Sign-in is not configured');
            this.logger.error(error.message);
            done(error, null as any);
            throw error;
        }

        this.logger.debug('LINE strategy validate called');

        // passport-line profile: { id, displayName, pictureUrl, statusMessage }
        const { id, displayName, pictureUrl: avatar } = profile;

        const authIdentity: AuthIdentity = {
            provider: AuthProvider.LINE,
            providerUserId: id,
            providerEmail: null, // LINE ไม่ส่ง email โดย default
            passwordHash: null,
            avatar,
        };

        const user: Omit<UserType, 'nameTag'> = {
            name: displayName ?? 'LINE User',
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
        return LineStrategy.isConfigured;
    }
}
