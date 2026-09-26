// -Path: "src/secure/dto/secure.dto.ts"

export const envConfigs = [
    'NODE_ENV',
    'API_TOKEN_KEY',
    'CLIENT_URL',
    'SERVER_HOST',
    'SERVER_PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRES_IN',
    'BCRYPT_ROUNDS',
    'PASSWORD_HASH_SALT',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'DISCORD_CLIENT_ID',
    'DISCORD_CLIENT_SECRET',
    'DISCORD_CALLBACK_URL',
] as const;

export type EnvConfig = {
    [key in (typeof envConfigs)[number]]?: string;
};
