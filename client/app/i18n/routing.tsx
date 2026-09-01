// -Path: 'Vite-React-Router-TypeScript/app/i18n/routing.tsx'
import type { Lang } from '~/i18n/locales';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Link as RouterLink, type NavigateOptions } from 'react-router';

/**
 * Prepends the lang prefix to a path.
 * @example
 * localizePath('th-TH', '/about') // → '/th-TH/about'
 * localizePath('th-TH', '/')      // → '/th-TH'
 */
export function localizePath(lang: Lang, path: string) {
    if (path.startsWith('/')) return `/${lang}${path === '/' ? '' : path}`;
    return path;
}

/**
 * Returns the current lang and a navigate function with lang prefix.
 */
export function useRouting() {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const { lang } = useParams<{ lang: Lang }>();
    const currentLang = lang ?? (i18n.language as Lang);

    const navigateTo = (to: string, options?: NavigateOptions) =>
        navigate(localizePath(currentLang, to), options);

    return { lang: currentLang, navigate: navigateTo };
}

type LinkProps = Omit<ComponentProps<typeof RouterLink>, 'to'> & {
    to: string;
    locale?: Lang;
};

/**
 * Link component that automatically prepends the lang prefix, similar to next-intl.
 * @example
 * <Link to="/about">About</Link>
 * // → <a href="/th-TH/about">
 *
 * <Link to="/about" locale="en-US">About</Link>
 * // → <a href="/en-US/about">
 */
export function Link({ to, locale, ...props }: LinkProps) {
    const { lang } = useRouting();
    const targetLang = locale ?? lang;
    return <RouterLink to={localizePath(targetLang, to)} {...props} />;
}

/**
 * Returns the current pathname without the lang prefix, similar to next-intl.
 * @example
 * // URL: /th-TH/about
 * usePathname() // → '/about'
 */
export function usePathname(): string {
    const location = useLocation();
    const { i18n } = useTranslation();
    const { lang } = useParams<{ lang: Lang }>();
    const currentLang = lang ?? (i18n.language as Lang);
    return location.pathname.replace(`/${currentLang}`, '') || '/';
}

/**
 * Router with automatic lang prefix, similar to next-intl.
 * @example
 * const router = useRouter()
 * router.push('/about')            // → navigate to /th-TH/about
 * router.push('/about', 'en-US')   // → navigate to /en-US/about
 * router.replace('/about')
 * router.switchLocale('en-US')     // → navigate to /en-US/{currentPath}
 */
export function useRouter() {
    const navigate = useNavigate();
    const pathname = usePathname();
    const { i18n } = useTranslation();
    const { lang } = useParams<{ lang: Lang }>();

    const resolveLang = (locale?: Lang) => locale ?? lang ?? (i18n.language as Lang);

    return {
        push: (path: string, locale?: Lang) => navigate(localizePath(resolveLang(locale), path)),

        replace: (path: string, locale?: Lang) =>
            navigate(localizePath(resolveLang(locale), path), { replace: true }),

        /** Switches locale while keeping the current path. */
        switchLocale: (locale: Lang) =>
            navigate(localizePath(resolveLang(locale), pathname), { replace: true }),
    };
}
