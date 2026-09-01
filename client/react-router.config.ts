// -Path: 'Vite-React-Router-TypeScript/react-router.config.ts'
import type { Config } from '@react-router/dev/config';

export default {
    // Config options...
    // Server-side render by default, to enable SPA mode set this to `false`
    ssr: true,
    basename: process.env.VITE_CLIENT_BASE || '/',
} satisfies Config;
