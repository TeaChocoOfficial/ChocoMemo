import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { authAPI } from '~/services/auth';
import { useAuthStore } from '~/stores/auth.store';
import { localizePath } from '~/i18n/routing';
import type { Lang } from '~/i18n/locales';

export default function AuthCallback() {
    const { lang } = useParams<{ lang: Lang }>();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        const callback = async () => {
            setLoading(true);
            try {
                const res = await authAPI.auth();
                setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
                navigate(localizePath(lang ?? (i18n.language as Lang), '/'), { replace: true });
            }
        };
        callback();
    }, [lang, i18n.language, navigate, setUser, setLoading]);

    return (
        <div className='flex min-h-dvh items-center justify-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent' />
        </div>
    );
}
