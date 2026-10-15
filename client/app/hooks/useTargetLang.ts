// -Path: 'client/app/hooks/useTargetLang.ts'
import { useSearchParams } from 'react-router';
import { useDeckListOptions } from '~/hooks/useDeckListOptions';
import { targetFromCode } from '~/utils/targetLang';
import { ALL_TARGETS, DEFAULT_TARGET_LANG, type Languages, type TargetFilter } from '~/data/language';

/**
 * The deck-list target selection: the `?target=` query first (so a shared link
 * is honoured), then the last target the viewer chose on a deck list, then the
 * default. Unlike {@link useTargetLang} this may be the "all languages" filter.
 */
export function useDeckTargetLang(): TargetFilter {
    const [searchParams] = useSearchParams();
    const { targetLang } = useDeckListOptions();
    return targetFromCode(searchParams.get('target')) ?? targetLang ?? DEFAULT_TARGET_LANG;
}

/**
 * The concrete target language a study surface is browsing. The deck list's
 * "all languages" filter names no single language, so it falls back to the
 * default here — every non-deck-list consumer keeps a real language.
 */
export function useTargetLang(): Languages {
    const filter = useDeckTargetLang();
    return filter === ALL_TARGETS ? DEFAULT_TARGET_LANG : filter;
}
