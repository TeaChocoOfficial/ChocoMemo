// -Path: 'client/app/utils/targetLang.ts'
import type { DeckData } from '~/types/deck';
import { Languages, languages } from '~/data/language';

/** BCP47 tags the Web Speech API speaks, per target language. `other` has no
 *  single language, so it falls back to a neutral tag until a deck supplies
 *  its own via `targetInfo.speechTag`. */
const SPEECH_LANG: Record<Languages, string> = {
    [Languages.en]: 'en-US',
    [Languages.ja]: 'ja-JP',
    [Languages.other]: 'en-US',
    [Languages.ko]: 'ko-KR',
    [Languages.th]: 'th-TH',
    [Languages.zh]: 'zh-CN',
};

/** The short URL code for a target language (`ja`, `en`, ...). */
export function targetCode(targetLang: Languages): string {
    return languages.find((language) => language.id === targetLang)?.code ?? 'ja';
}

/** Resolve a short URL code back to a target language, or `undefined`. */
export function targetFromCode(code: string | null | undefined): Languages | undefined {
    if (!code) return undefined;
    return languages.find((language) => language.code === code)?.id;
}

/** The BCP47 tag the Web Speech API should speak for a target language. */
export function targetSpeechLang(targetLang: Languages): string {
    return SPEECH_LANG[targetLang];
}

/**
 * The BCP47 tag to speak a deck with: the deck's own tag for an `other` deck,
 * else the target language's.
 *
 * @todo Deck session pages will pass `deck.targetInfo.speechTag` to `useSpeak`
 * once they exist; today only the target language is known.
 */
export function deckSpeechLang(deck: Pick<DeckData, 'targetLang' | 'targetInfo'>): string {
    return deck.targetInfo?.speechTag ?? targetSpeechLang(deck.targetLang);
}

/**
 * Append the `?target=` filter to a path so a deck-list link stays shareable
 * and the loader/SSR can read the target without the persisted store.
 */
export function withTarget(path: string, targetLang: Languages): string {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}target=${targetCode(targetLang)}`;
}
