// -Path: "src/user/auth/strategies/discord.strategy.ts"
import { Role } from '~/types/auth';
import { AuthProvider } from '~/types/auth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { SecureService } from '~/secure/secure.service';
import type { UserType } from '../../dto/create-user.dto';
import { Scope, Strategy, type Profile } from 'passport-discord-auth';
import type { AuthIdentity } from '../schemas/auth-identity.schema';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    private static isConfigured = false;
    private readonly logger = new Logger(DiscordStrategy.name);

    constructor(readonly secureService: SecureService) {
        const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_CALLBACK_URL } =
            secureService.getEnvConfig();

        // Fail fast at boot rather than accepting a dummy strategy: a missing
        // credential would otherwise only surface as an opaque 500 the first
        // time somebody clicked "Sign in with Discord". `throw` before
        // `super()` is legal — it terminates the constructor. Testing the
        // three values directly also narrows them to `string` below.
        if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_CALLBACK_URL) {
            throw new Error(
                'Discord OAuth is not configured: set DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET and DISCORD_CALLBACK_URL.',
            );
        }

        DiscordStrategy.isConfigured = true;
        super({
            clientId: DISCORD_CLIENT_ID,
            clientSecret: DISCORD_CLIENT_SECRET,
            callbackUrl: DISCORD_CALLBACK_URL,
            scope: [Scope.Email, Scope.Identify],
            passReqToCallback: false,
        });

        this.logger.log('Discord Strategy initialized successfully');
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any) => void,
    ): Promise<Omit<UserType, 'nameTag'>> {
        if (!DiscordStrategy.isConfigured) {
            const error = new Error('Discord Sign-in is not configured');
            this.logger.error(error.message);
            done(error, null as any);
            throw error;
        }

        this.logger.debug('Discord strategy validate called');

        const { id, username, global_name, email, avatar } = profile;

        // Discord: avatar เป็น hash ต้องประกอบ URL เอง
        // ถ้าไม่มี avatar → ใช้ default avatar
        const avatarUrl = avatar
            ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(id) % 5n)}.png`;

        const authIdentity: AuthIdentity = {
            provider: AuthProvider.DISCORD,
            providerUserId: id,
            providerEmail: email ?? null,
            passwordHash: null,
            avatar: avatarUrl,
        };

        // Discord: global_name = display name, username = handle
        const displayName = global_name || username;

        const user: Omit<UserType, 'nameTag'> = {
            name: displayName,
            avatar: avatarUrl,
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
        return DiscordStrategy.isConfigured;
    }
}
