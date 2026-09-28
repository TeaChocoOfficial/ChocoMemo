import { useLayoutEffect } from 'react';
import { authAPI } from '~/services/auth';
import { useAuthStore } from '~/stores/config/auth.store';
import { useSocketStore } from '~/stores/config/socket.store';
import { applyTheme, useThemeStore } from '~/stores/config/theme.store';

export default function Setup({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();
    const { connect, disconnect } = useSocketStore();
    const { setUser, setError, setLoading } = useAuthStore();

    useLayoutEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useLayoutEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    useLayoutEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await authAPI.auth();
                console.log('====================================');
                console.log(res.data);
                console.log('====================================');
                setUser(res.data);
            } catch (err) {
                setError(err as Error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [setUser, setError, setLoading]);

    return <>{children}</>;
}
