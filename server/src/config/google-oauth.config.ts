// -Path: "src/config/google-oauth.config.ts"
import { registerAs } from '@nestjs/config';

const googleOauthConfig = registerAs('googleOAuth', () => ({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
}));

export default googleOauthConfig;
