// -Path: "vite-extra-react-ssr-ts/src/stores/themeStore.ts"
import { create } from 'zustand';
import { persist, type StorageValue } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
    theme: ThemeMode;
    _hydrated: boolean;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
}

const getInitialTheme = (): ThemeMode => {
    if (typeof document === 'undefined') return 'light';

    const match = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/);
    if (match && ['dark', 'light'].includes(match[1])) return match[1] as ThemeMode;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const cookieStorage = {
    getItem: (_name: string): StorageValue<ThemeState> | null => {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/);
        if (!match) return null;
        return { state: { theme: match[1] as ThemeMode } } as StorageValue<ThemeState>;
    },
    setItem: (_name: string, value: StorageValue<ThemeState>) => {
        if (typeof document === 'undefined') return;
        const theme = value.state.theme;
        document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    },
    removeItem: (_name: string) => {
        if (typeof document === 'undefined') return;
        document.cookie = 'theme=; path=/; max-age=0';
    },
};
const applyTheme = (theme: ThemeMode) => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: getInitialTheme(),
            _hydrated: false,
            toggleTheme: () =>
                set((state) => {
                    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
                    applyTheme(newTheme);
                    return { theme: newTheme };
                }),
            setTheme: (theme) => {
                applyTheme(theme);
                set({ theme });
            },
        }),
        {
            name: 'theme',
            storage: cookieStorage,
            onRehydrateStorage: () => (state) => {
                if (state) state._hydrated = true;
            },
        },
    ),
);
