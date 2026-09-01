import { useLayoutEffect } from 'react';
import { applyTheme, useThemeStore } from '~/stores/theme.store';

export default function Setup({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();

    useLayoutEffect(() => {
        applyTheme(theme);
    }, [theme]);

    return <>{children}</>;
}