// -Path: 'client/app/hooks/useVocabMeaning.ts'
import type { LangText } from '~/types/type';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS, type Lang } from '~/i18n/locales';

const FALLBACK_ORDER: Lang[] = ['en-US', ...SUPPORTED_LANGS.filter((l) => l !== 'en-US')];

/** Map any detected language string to a supported locale by exact code or
 *  language subtag, falling back to English. */
function normalizeLang(lang: string): Lang {
    const exact = SUPPORTED_LANGS.find((l) => l === lang);
    if (exact) return exact;
    const base = lang.toLowerCase().split('-')[0];
    const bySubtag = SUPPORTED_LANGS.find((l) => l.toLowerCase().startsWith(base));
    return bySubtag ?? 'en-US';
}

/** Localized meaning: plain strings pass through; records pick the user's
 *  language, falling back to en-US then the first available key. */
export function resolveText(text: LangText, lang: string): string {
    if (typeof text === 'string') return text;
    const direct = text[normalizeLang(lang)];
    if (direct != null) return direct;
    const fallback = FALLBACK_ORDER.find((l) => text[l]);
    return fallback ? text[fallback] ?? '' : '';
}

/** Returns a resolver bound to the current i18n language. */
export function useLangText() {
    const { i18n } = useTranslation();
    return (text: LangText) => resolveText(text, i18n.language);
}