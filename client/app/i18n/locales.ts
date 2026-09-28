// -Path: 'Vite-React-Router-TypeScript/app/i18n/locales.ts'
import enLocale from './locales/en.json';
import thLocale from './locales/th.json';
import jaLocale from './locales/ja.json';
import zhLocale from './locales/zh.json';
import koLocale from './locales/ko.json';
import viLocale from './locales/vi.json';
import idLocale from './locales/id.json';
import esLocale from './locales/es.json';
import ptLocale from './locales/pt.json';
import frLocale from './locales/fr.json';
import deLocale from './locales/de.json';
import arLocale from './locales/ar.json';
import hiLocale from './locales/hi.json';
import ruLocale from './locales/ru.json';
import itLocale from './locales/it.json';
import trLocale from './locales/tr.json';
import filLocale from './locales/fil.json';
import msLocale from './locales/ms.json';

/**
 * UI locales, keyed by bare language subtag.
 *
 * Short codes are used rather than region tags (`en-US`) so they line up
 * directly with what `navigator.language` reports: the browser says `th` or
 * `ja`, and no conversion step is needed to match a supported locale. The
 * `Lang` type is derived from these keys, so adding a locale here is enough.
 */
export const resources = {
    en: { translation: enLocale },
    th: { translation: thLocale },
    ja: { translation: jaLocale },
    zh: { translation: zhLocale },
    ko: { translation: koLocale },
    vi: { translation: viLocale },
    id: { translation: idLocale },
    es: { translation: esLocale },
    pt: { translation: ptLocale },
    fr: { translation: frLocale },
    de: { translation: deLocale },
    ar: { translation: arLocale },
    hi: { translation: hiLocale },
    ru: { translation: ruLocale },
    it: { translation: itLocale },
    tr: { translation: trLocale },
    fil: { translation: filLocale },
    ms: { translation: msLocale },
} as const;

export const SUPPORTED_LANGS = Object.keys(resources) as (keyof typeof resources)[];
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const isValidLang = (lang: string): lang is Lang => SUPPORTED_LANGS.includes(lang as Lang);
