//-Path: 'Vite-React-TypeScript/src/secure/env.ts'
import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';
import { SUPPORTED_LANGS } from '~/i18n/locales';

const rawEnv = createEnv({
    client: {
        VITE_CLIENT_BASE: z.string().default('/'),
        VITE_MODE: z.enum(['development', 'production', 'test']).default('development'),
        VITE_CLIENT_HOST: z.string().default('0.0.0.0'),
        VITE_CLIENT_PORT: z.coerce.number().int().positive().default(8000),
        VITE_API_URL: z.string().url().default('http://127.0.0.1:3000'),
        VITE_API_TOKEN_KEY: z.string().default(''),
        VITE_DEFAULT_LANG: z.enum(SUPPORTED_LANGS).default('en-US'),
    },
    clientPrefix: 'VITE_',
    runtimeEnv: import.meta.env,
    emptyStringAsUndefined: true,
});

const env = {
    BASE: rawEnv.VITE_CLIENT_BASE,
    MODE: rawEnv.VITE_MODE,
    HOST: rawEnv.VITE_CLIENT_HOST,
    PORT: rawEnv.VITE_CLIENT_PORT,
    API_URL: rawEnv.VITE_API_URL,
    API_TOKEN_KEY: rawEnv.VITE_API_TOKEN_KEY,
    DEFAULT_LANG: rawEnv.VITE_DEFAULT_LANG,
} as const;

export const isDev = env.MODE === 'development';

export default env;
