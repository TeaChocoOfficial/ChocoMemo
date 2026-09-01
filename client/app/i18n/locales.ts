// -Path: 'Vite-React-Router-TypeScript/app/i18n/locales.ts'
import enLocale from './locales/en-US.json';
import thLocale from './locales/th-TH.json';
import jaLocale from './locales/ja-JP.json';
import zhLocale from './locales/zh-CN.json';

export const resources = {
    'en-US': { translation: enLocale },
    'th-TH': { translation: thLocale },
    'ja-JP': { translation: jaLocale },
    'zh-CN': { translation: zhLocale },
} as const;

export const SUPPORTED_LANGS = Object.keys(resources) as (keyof typeof resources)[];
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const isValidLang = (lang: string): lang is Lang => SUPPORTED_LANGS.includes(lang as Lang);
