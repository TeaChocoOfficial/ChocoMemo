// -Path: 'Vite-React-Router-TypeScript/app/utils/url.ts'
import env from '~/secure/env';

export function getFullUrl(path: string): string {
    const baseUrl =
        typeof window !== 'undefined'
            ? window.location.origin
            : process.env.BASE_URL || 'http://localhost:8000';

    // clean up path
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const cleanBase = env.BASE === '/' ? '' : env.BASE;

    return `${baseUrl}${cleanBase}${cleanPath}`;
}

export function getAssetUrl(path: string): string {
    // สำหรับ asset ใน public folder
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const cleanBase = env.BASE === '/' ? '' : env.BASE;

    if (typeof window !== 'undefined') {
        return `${window.location.origin}${cleanBase}${cleanPath}`;
    }

    // SSR: ใช้ environment variable
    return `${process.env.BASE_URL || ''}${cleanBase}${cleanPath}`;
}
