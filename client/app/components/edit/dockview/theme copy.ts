// -Path: 'ui\src\pages\workspace\dockview\theme.ts'
import {
    themeDark,
    themeLight,
    themeVisualStudio,
    themeAbyss,
    themeDracula,
    themeAbyssSpaced,
    themeLightSpaced,
    themeNord,
    themeNordSpaced,
    themeCatppuccinMocha,
    themeCatppuccinMochaSpaced,
    themeMonokai,
    themeSolarizedLight,
    themeSolarizedLightSpaced,
    themeGithubDark,
    themeGithubDarkSpaced,
    themeGithubLight,
    themeGithubLightSpaced,
} from 'dockview-react';

export const dockviewThemes = {
    Choco: {
        name: 'choco',
        className: 'dockview-theme-dark dockview-theme-choco',
        colorScheme: 'dark',
    },
    Dark: themeDark,
    Light: themeLight,
    VisualStudio: themeVisualStudio,
    Abyss: themeAbyss,
    Dracula: themeDracula,
    AbyssSpaced: themeAbyssSpaced,
    LightSpaced: themeLightSpaced,
    Nord: themeNord,
    NordSpaced: themeNordSpaced,
    CatppuccinMocha: themeCatppuccinMocha,
    CatppuccinMochaSpaced: themeCatppuccinMochaSpaced,
    Monokai: themeMonokai,
    SolarizedLight: themeSolarizedLight,
    SolarizedLightSpaced: themeSolarizedLightSpaced,
    GithubDark: themeGithubDark,
    GithubDarkSpaced: themeGithubDarkSpaced,
    GithubLight: themeGithubLight,
    GithubLightSpaced: themeGithubLightSpaced,
} as const;

export type DockviewThemeKeys = keyof typeof dockviewThemes;
