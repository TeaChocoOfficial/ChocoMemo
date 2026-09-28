// -Path: "client/app/stores/theme.store.ts"
import type { IconType } from 'react-icons';
import {
    TbCherry,
    TbCookieFilled,
    TbFileText,
    TbLeaf,
    TbLeafMaple,
    TbMoonStars,
    TbSnowflake,
} from 'react-icons/tb';
import { create } from 'zustand';
import { persist, type StorageValue } from 'zustand/middleware';

export type ThemeName =
    | 'light-choco'
    | 'dark-choco'
    | 'dark-galaxy'
    | 'light-galaxy'
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

/** The theme used when nothing is stored. Deliberately NOT derived from
 *  `prefers-color-scheme`: visitors on a dark OS still get light-choco, and
 *  the dark variants stay a deliberate choice rather than an inherited one. */
export const DEFAULT_THEME: ThemeName = 'light-choco';

export interface ThemeDefinition {
    id: ThemeName;
    dark: boolean;
    icon: IconType;
    labelKey: string;
    swatch: string;
}

export const THEMES: ThemeDefinition[] = [
    {
        id: 'light-choco',
        dark: false,
        icon: TbCookieFilled,
        labelKey: 'lightChoco',
        swatch: 'linear-gradient(135deg, #f6ece0, #7b4a2a 45%, #c98a4b 65%, #f6ece0)',
    },
    {
        id: 'dark-choco',
        dark: true,
        icon: TbCookieFilled,
        labelKey: 'darkChoco',
        swatch: 'linear-gradient(135deg, #1a1008, #a9713f 45%, #e0a765 65%, #1a1008)',
    },
    {
        id: 'dark-galaxy',
        dark: true,
        icon: TbMoonStars,
        labelKey: 'darkGalaxy',
        swatch: 'linear-gradient(135deg, #0b0a1f, #7c5cff 45%, #43d9ff 65%, #0b0a1f)',
    },
    {
        id: 'light-galaxy',
        dark: false,
        icon: TbMoonStars,
        labelKey: 'lightGalaxy',
        swatch: 'linear-gradient(135deg, #f2f1fb, #4f46b8 45%, #7c5cff 65%, #f2f1fb)',
    },
    {
        id: 'dark-sakura',
        dark: true,
        icon: TbCherry,
        labelKey: 'darkSakura',
        swatch: 'linear-gradient(135deg, #231018, #e0538a 45%, #fdb04c 65%, #231018)',
    },
    {
        id: 'light-sakura',
        dark: false,
        icon: TbCherry,
        labelKey: 'lightSakura',
        swatch: 'linear-gradient(135deg, #ffe3ef, #ff9ec3 45%, #ffd166 65%, #ffe3ef)',
    },
    {
        id: 'dark-paper',
        dark: true,
        icon: TbFileText,
        labelKey: 'darkPaper',
        swatch: 'linear-gradient(135deg, #171205, #f6cf31 45%, #a97b12 65%, #171205)',
    },
    {
        id: 'light-paper',
        dark: false,
        icon: TbFileText,
        labelKey: 'lightPaper',
        swatch: 'linear-gradient(135deg, #fbf7e0, #d7ae09 45%, #8a6a10 65%, #fbf7e0)',
    },
    {
        id: 'dark-nature',
        dark: true,
        icon: TbLeaf,
        labelKey: 'darkNature',
        swatch: 'linear-gradient(135deg, #0f140b, #7fb347 45%, #e0c04a 65%, #0f140b)',
    },
    {
        id: 'light-nature',
        dark: false,
        icon: TbLeaf,
        labelKey: 'lightNature',
        swatch: 'linear-gradient(135deg, #eef3e3, #7aa93c 45%, #e0c04a 65%, #eef3e3)',
    },
    {
        id: 'dark-autumn',
        dark: true,
        icon: TbLeafMaple,
        labelKey: 'darkAutumn',
        swatch: 'linear-gradient(135deg, #1c0f0b, #e05c3c 45%, #f5a623 65%, #1c0f0b)',
    },
    {
        id: 'light-autumn',
        dark: false,
        icon: TbLeafMaple,
        labelKey: 'lightAutumn',
        swatch: 'linear-gradient(135deg, #fbf0e4, #d9543a 45%, #f5a94a 65%, #fbf0e4)',
    },
    {
        id: 'dark-winter',
        dark: true,
        icon: TbSnowflake,
        labelKey: 'darkWinter',
        swatch: 'linear-gradient(135deg, #0b1218, #62b6e8 45%, #a594e0 65%, #0b1218)',
    },
    {
        id: 'light-winter',
        dark: false,
        icon: TbSnowflake,
        labelKey: 'lightWinter',
        swatch: 'linear-gradient(135deg, #eef4fc, #6fb9e8 45%, #a594e0 65%, #eef4fc)',
    },
];

const isThemeName = (value: string): value is ThemeName => THEMES.some((t) => t.id === value);

const getThemeDefinition = (theme: ThemeName): ThemeDefinition =>
    THEMES.find((t) => t.id === theme) ?? THEMES[0];

const getInitialTheme = (): ThemeName => {
    if (typeof document === 'undefined') return DEFAULT_THEME;

    const match = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/);
    if (match && isThemeName(match[1])) return match[1];

    return DEFAULT_THEME;
};

const initialTheme = getInitialTheme();

interface ThemeState {
    theme: ThemeName;
    isDark: boolean;
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
    const { dark } = getThemeDefinition(theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: initialTheme,
            isDark: getThemeDefinition(initialTheme).dark,
            _hydrated: false,
            setTheme: (theme) => {
                applyTheme(theme);
                set({ theme, isDark: getThemeDefinition(theme).dark });
            },
        }),
        {
            name: 'theme',
            storage: cookieStorage,
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state._hydrated = true;
                    state.isDark = getThemeDefinition(state.theme).dark;
                    applyTheme(state.theme);
                }
            },
        },
    ),
);