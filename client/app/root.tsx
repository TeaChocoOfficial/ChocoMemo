// -Path: 'Vite-React-Router-TypeScript/app/root.tsx'
import '~/i18n';
import './app.css';
import {
    Meta,
    Links,
    Outlet,
    Scripts,
    redirect,
    ScrollRestoration,
    isRouteErrorResponse,
    type LoaderFunctionArgs,
} from 'react-router';
import i18n from '~/i18n';
import env, { isDev } from '~/secure/env';
import type { Route } from './+types/root';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS, type Lang } from '~/i18n/locales';

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const basePath = env.BASE.replace(/\/+$/, '');
    const pathname = url.pathname.replace(/\/+$/, '') || '/';

    const isRootPath = pathname === (basePath || '/');
    const isLanguagePath = SUPPORTED_LANGS.some(
        (lang) => pathname === `${basePath}/${lang}` || pathname.startsWith(`${basePath}/${lang}/`),
    );

    if (isRootPath && !isLanguagePath) {
        let targetLang = i18n.language;
        const cookieLang = request.headers.get('cookie')?.match(/lang=([^;]+)/)?.[1];
        if (cookieLang && SUPPORTED_LANGS.includes(cookieLang as Lang)) targetLang = cookieLang;
        return redirect(`${basePath}/${targetLang}`.replace(/\/+/g, '/'));
    }

    return {};
}

export const links: Route.LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
    },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation();

    return (
        <html lang={i18n.language} suppressHydrationWarning>
            <head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' type='image/x-icon' href={env.BASE + 'favicon.ico'} />
                <Meta />
                <Links />
                {SUPPORTED_LANGS.map((lang) => (
                    <link
                        key={lang}
                        rel='alternate'
                        hrefLang={lang}
                        href={`https://example.com/${lang}`}
                    />
                ))}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.__INITIAL_I18N_STORE__ = ${JSON.stringify(i18n.store.data)};
                            window.__INITIAL_I18N_LANGUAGE__ = '${i18n.language}';
                        `,
                    }}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function () {
                                try {
                                    var t = document.cookie.match(/(?:^|;\\s*)theme=([^;]+)/);
                                    var saved = t ? t[1] : localStorage.getItem('theme');
                                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                    var isDark = saved === 'dark' || (!saved && prefersDark);
                                    if (isDark) document.documentElement.classList.add('dark');
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    const { t } = useTranslation();

    let message = t('common.error.oops');
    let details = t('common.error.unexpected');
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? '404' : 'Error';
        details =
            error.status === 404
                ? t('common.error.notFound') // ? 'The requested page could not be found.'
                : error.statusText || details;
    } else if (isDev && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className='pt-16 p-4 container mx-auto'>
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className='w-full p-4 overflow-x-auto'>
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
