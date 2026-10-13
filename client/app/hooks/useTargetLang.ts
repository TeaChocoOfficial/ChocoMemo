// -Path: 'client/app/hooks/useTargetLang.ts'
import { useSearchParams } from 'react-router';
import { useDeckListOptions } from '~/hooks/useDeckListOptions';
import { targetFromCode } from '~/utils/targetLang';
import { DEFAULT_TARGET_LANG, type Languages } from '~/data/language';

/**
 * The target language a deck list is browsing: the `?target=` query first (so a
 * shared link is honoured), then the last target the viewer chose on a deck
 * list, then the default.
 */
export function useTargetLang(): Languages {
    const [searchParams] = useSearchParams();
    const { targetLang } = useDeckListOptions();
    return targetFromCode(searchParams.get('target')) ?? targetLang ?? DEFAULT_TARGET_LANG;
}
