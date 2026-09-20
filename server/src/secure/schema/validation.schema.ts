// -Path: "Nest TypeScript/src/secure/schema/validation.schema.ts"
import Joi from 'joi';

export const validationSchema = Joi.object({
    // Core application settings
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('development'),

    // Client settings
    API_TOKEN_KEY: Joi.string()
        .min(16)
        .required()
        .description('API token key for client-side authentication'),
    CLIENT_URL: Joi.string()
        .uri()
        .default('http://127.0.0.1:8000')
        .description('Frontend client URL'),

    // Server settings (แก้ SERVER_HOSE เป็น SERVER_HOST)
    SERVER_HOST: Joi.string().hostname().default('0.0.0.0').description('Server host address'),
    SERVER_PORT: Joi.number().port().default(3000).description('Server port number'),

    // Database settings
    MONGODB_URI: Joi.string().uri().required().description('MongoDB connection URI'),

    // JWT settings
    JWT_SECRET: Joi.string().min(32).required().description('JWT secret key for access tokens'),
    JWT_EXPIRES_IN: Joi.string()
        .default('1d')
        .pattern(/^(\d+)([smhdwMy])$/)
        .description('JWT expiration time (e.g., 1d, 2h, 30m)'),
    JWT_REFRESH_SECRET: Joi.string()
        .min(32)
        .required()
        .description('JWT secret key for refresh tokens'),
    JWT_REFRESH_EXPIRES_IN: Joi.string()
        .default('7d')
        .pattern(/^(\d+)([smhdwMy])$/)
        .description('Refresh token expiration time'),

    // Security settings
    BCRYPT_ROUNDS: Joi.number()
        .integer()
        .min(10)
        .max(20)
        .default(12)
        .description('BCrypt salt rounds for password hashing'),

    PASSWORD_HASH_SALT: Joi.string().required().description('Default admin password'),

    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_CALLBACK_URL: Joi.string().required(),

    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().required(),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),
    SMTP_FROM: Joi.string().required(),
})
    // ใช้ unknown() เพื่อให้ validation ไม่ error เมื่อมี env variables อื่นๆ ที่ไม่ได้กำหนด
    .unknown(true);
