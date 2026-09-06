// -Path: 'Vite-React-Router-TypeScript/app/i18n/locales.ts'
import enLocale from './locales/en-US.json';
import thLocale from './locales/th-TH.json';
import jaLocale from './locales/ja-JP.json';
import zhLocale from './locales/zh-CN.json';
import koLocale from './locales/ko-KR.json';
import viLocale from './locales/vi-VN.json';
import idLocale from './locales/id-ID.json';
import esLocale from './locales/es-ES.json';
import ptLocale from './locales/pt-BR.json';
import frLocale from './locales/fr-FR.json';
import deLocale from './locales/de-DE.json';
import arLocale from './locales/ar-SA.json';
import hiLocale from './locales/hi-IN.json';
import ruLocale from './locales/ru-RU.json';
import itLocale from './locales/it-IT.json';
import trLocale from './locales/tr-TR.json';
import filLocale from './locales/fil-PH.json';
import msLocale from './locales/ms-MY.json';

export const resources = {
    'en-US': { translation: enLocale },
    'th-TH': { translation: thLocale },
    'ja-JP': { translation: jaLocale },
    'zh-CN': { translation: zhLocale },
    'ko-KR': { translation: koLocale },
    'vi-VN': { translation: viLocale },
    'id-ID': { translation: idLocale },
    'es-ES': { translation: esLocale },
    'pt-BR': { translation: ptLocale },
    'fr-FR': { translation: frLocale },
    'de-DE': { translation: deLocale },
    'ar-SA': { translation: arLocale },
    'hi-IN': { translation: hiLocale },
    'ru-RU': { translation: ruLocale },
    'it-IT': { translation: itLocale },
    'tr-TR': { translation: trLocale },
    'fil-PH': { translation: filLocale },
    'ms-MY': { translation: msLocale },
} as const;

export const SUPPORTED_LANGS = Object.keys(resources) as (keyof typeof resources)[];
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const isValidLang = (lang: string): lang is Lang => SUPPORTED_LANGS.includes(lang as Lang);
