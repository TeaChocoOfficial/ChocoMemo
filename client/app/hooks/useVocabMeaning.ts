// -Path: 'client/app/hooks/useVocabMeaning.ts'
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGS, type Lang } from '~/i18n/locales';
import type { VocabMeaning } from '~/types/vocabulary';

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
export function resolveMeaning(meaning: VocabMeaning, lang: string): string {
    if (typeof meaning === 'string') return meaning;
    const direct = meaning[normalizeLang(lang)];
    if (direct != null) return direct;
    const fallback = FALLBACK_ORDER.find((l) => meaning[l]);
    return fallback ? meaning[fallback] ?? '' : '';
}

/** Returns a resolver bound to the current i18n language. */
export function useVocabMeaning() {
    const { i18n } = useTranslation();
    return (meaning: VocabMeaning) => resolveMeaning(meaning, i18n.language);
}