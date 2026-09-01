// -Path: 'Vite-React-Router-TypeScript/vite.config.ts'
import chalk from 'chalk';
import type { PluginOption } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import { reactRouter } from '@react-router/dev/vite';

const time = Date.now();

function wellKnownHandler() {
    return {
        name: 'well-known-handler',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url?.startsWith('/.well-known/')) {
                    res.statusCode = 404;
                    res.end();
                    return;
                }
                next();
            });
        },
    } satisfies PluginOption;
}

function teachocoBanner() {
    return {
        name: 'custom-banner',
        configureServer(server) {
            const originalPrint = server.printUrls.bind(server);
            server.printUrls = () => {
                console.log(
                    `\n    ${chalk.bold.green('VITE')} ${chalk.red('React Router TypeScript')} by ${chalk.bold.blue('TeaChoco')} ${chalk.gray(`ready in ${Date.now() - time} ms`)}\n`,
                );
                originalPrint();
            };
        },
    } satisfies PluginOption;
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const base = String(env.VITE_CLIENT_BASE || '/');
    const port = Number(env.VITE_CLIENT_PORT || 8000);
    const host = String(env.VITE_CLIENT_HOST || '0.0.0.0');
    const isDev = env.VITE_MODE === 'development';

    return {
        base,
        plugins: [teachocoBanner(), tailwindcss(), reactRouter(), wellKnownHandler()],
        resolve: {
            tsconfigPaths: true,
        },
        server: {
            port,
            host,
            strictPort: isDev ? true : undefined,
        },
    };
});
