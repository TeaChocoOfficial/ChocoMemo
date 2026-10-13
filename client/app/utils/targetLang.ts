// -Path: 'client/app/utils/targetLang.ts'
import { Languages, languages } from '~/data/language';

/** BCP47 tags the Web Speech API speaks, per target language. */
const SPEECH_LANG: Record<Languages, string> = {
    [Languages.en]: 'en-US',
    [Languages.ja]: 'ja-JP',
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
 * Append the `?target=` filter to a path so a deck-list link stays shareable
 * and the loader/SSR can read the target without the persisted store.
 */
export function withTarget(path: string, targetLang: Languages): string {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}target=${targetCode(targetLang)}`;
}
