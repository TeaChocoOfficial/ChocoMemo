import { registerAs } from '@nestjs/config';

const discordOauthConfig = registerAs('discordOauth', () => ({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackUrl: process.env.DISCORD_CALLBACK_URL,
    scopes: ['identify', 'email'], // Discord scope ที่ต้องใช้ [citation:9]
}));
export default discordOauthConfig;
