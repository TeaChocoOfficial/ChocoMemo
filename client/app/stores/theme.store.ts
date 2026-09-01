// -Path: "client/app/stores/theme.store.ts"
import { create } from 'zustand';
import { persist, type StorageValue } from 'zustand/middleware';

export type ThemeName =
    | 'dark'
    | 'light'
    | 'dark-sakura'
    | 'light-sakura'
    | 'dark-paper'
    | 'light-paper'
    | 'dark-nature'
    | 'light-nature'
    | 'dark-autumn'
    | 'light-autumn'
    | 'dark-winter'
    | 'light-winter';

export interface ThemeDefinition {
    id: ThemeName;
    kanji: string;
    labelKey: string;
    dark: boolean;
    swatch: string;
}

export const THEMES: ThemeDefinition[] = [
    {
        id: 'dark',
        kanji: '墨',
        labelKey: 'dark',
        dark: true,
        swatch: 'conic-gradient(from 210deg at 35% 35%, #151520, #6d5ae0 45%, #f5b84c 65%, #151520)',
    },
    {
        id: 'light',
        kanji: '光',
        labelKey: 'light',
        dark: false,
        swatch: 'linear-gradient(135deg, #f6f1e5, #e8f1f0 45%, #f6b83d 65%, #f6f1e5)',
    },
    {
        id: 'dark-sakura',
        kanji: '桜',
        labelKey: 'darkSakura',
        dark: true,
        swatch: 'linear-gradient(135deg, #231018, #e0538a 45%, #fdb04c 65%, #231018)',
    },
    {
        id: 'light-sakura',
        kanji: '桜',
        labelKey: 'lightSakura',
        dark: false,
        swatch: 'linear-gradient(135deg, #ffe3ef, #ff9ec3 45%, #ffd166 65%, #ffe3ef)',
    },
    {
        id: 'dark-paper',
        kanji: '紙',
        labelKey: 'darkPaper',
        dark: true,
        swatch: 'linear-gradient(135deg, #14100b, #c98a4b 45%, #2f9e8f 65%, #14100b)',
    },
    {
        id: 'light-paper',
        kanji: '紙',
        labelKey: 'lightPaper',
        dark: false,
        swatch: 'linear-gradient(135deg, #f7f1e4, #c9865a 45%, #e8c44a 65%, #f7f1e4)',
    },
    {
        id: 'dark-nature',
        kanji: '茶',
        labelKey: 'darkNature',
        dark: true,
        swatch: 'linear-gradient(135deg, #0f140b, #7fb347 45%, #e0c04a 65%, #0f140b)',
    },
    {
        id: 'light-nature',
        kanji: '茶',
        labelKey: 'lightNature',
        dark: false,
        swatch: 'linear-gradient(135deg, #eef3e3, #7aa93c 45%, #e0c04a 65%, #eef3e3)',
    },
    {
        id: 'dark-autumn',
        kanji: '楓',
        labelKey: 'darkAutumn',
        dark: true,
        swatch: 'linear-gradient(135deg, #1c0f0b, #e05c3c 45%, #f5a623 65%, #1c0f0b)',
    },
    {
        id: 'light-autumn',
        kanji: '楓',
        labelKey: 'lightAutumn',
        dark: false,
        swatch: 'linear-gradient(135deg, #fbf0e4, #d9543a 45%, #f5a94a 65%, #fbf0e4)',
    },
    {
        id: 'dark-winter',
        kanji: '雪',
        labelKey: 'darkWinter',
        dark: true,
        swatch: 'linear-gradient(135deg, #0b1218, #62b6e8 45%, #a594e0 65%, #0b1218)',
    },
    {
        id: 'light-winter',
        kanji: '雪',
        labelKey: 'lightWinter',
        dark: false,
        swatch: 'linear-gradient(135deg, #eef4fc, #6fb9e8 45%, #a594e0 65%, #eef4fc)',
    },
];

const isThemeName = (value: string): value is ThemeName => THEMES.some((t) => t.id === value);

const getInitialTheme = (): ThemeName => {
    if (typeof document === 'undefined') return 'light';

    const match = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/);
    if (match && isThemeName(match[1])) return match[1];

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

interface ThemeState {
    theme: ThemeName;
    _hydrated: boolean;
    setTheme: (theme: ThemeName) => void;
}

const cookieStorage = {
    getItem: (_name: string): StorageValue<ThemeState> | null => {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/);
        if (!match) return null;
        return { state: { theme: match[1] as ThemeName } } as StorageValue<ThemeState>;
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

export const applyTheme = (theme: ThemeName) => {
    if (typeof document === 'undefined') return;
    const { dark } = THEMES.find((t) => t.id === theme) ?? THEMES[0];
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: getInitialTheme(),
            _hydrated: false,
            setTheme: (theme) => {
                applyTheme(theme);
                set({ theme });
            },
        }),
        {
            name: 'theme',
            storage: cookieStorage,
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state._hydrated = true;
                    applyTheme(state.theme);
                }
            },
        },
    ),
);