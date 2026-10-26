// -Path: 'client/app/data/language.ts'

/**
 * Study languages — the language a learner is studying, not the interface
 * language. The UI locale is `Lang` (`app/i18n/locales.ts`); this enum is the
 * `targetLang` used by decks, the hub and the character charts.
 */
export enum Languages {
    en = 'english',
    ja = 'japanese',
    ko = 'korean',
    th = 'thai',
    zh = 'chinese',
    other = 'other',
}

export type LangCode = keyof typeof Languages;

export type Language = (typeof Languages)[LangCode];

/** The character set a target language teaches, when it has one yet. */
export type CharacterSetId = 'kana' | 'alphabet' | 'hangul' | 'hanzi' | 'thai';

/** Glyph for the catch-all "Another language" target. Declared once so the
 *  switcher and the Landing read the same mark. */
export const OTHER_GLYPH = '🌐';

/** The target a deck list browses when no `?target=` is present. */
export const DEFAULT_TARGET_LANG = Languages.ja;

/** The deck-list "every language" filter, alongside a concrete target. */
export const ALL_TARGETS = 'all';

/** A deck-list target selection: one language, or every language at once. */
export type TargetFilter = Languages | typeof ALL_TARGETS;

/**
 * One target language's capabilities. This is the single config the menus, the
 * study hub and the character routes read, so a language's glyph, its
 * character chart and its drill are declared once instead of per component.
 */
export interface AvailableLanguage {
    id: Languages;
    /** Short code used in the URL (`?target=ja`). */
    code: LangCode;
    glyph: string;
    /** Flag emoji for the language, e.g. 🇯🇵. `other` uses the globe. */
    flag: string;
    /** Scripts/count subtitle, e.g. "ひらがな · カタカナ". */
    subtitle: string;
}

export const languages: AvailableLanguage[] = [
    {
        id: Languages.en,
        code: 'en',
        glyph: 'A',
        flag: '🇺🇸',
        subtitle: 'A – Z',
    },
    {
        id: Languages.ja,
        code: 'ja',
        glyph: 'あ',
        flag: '🇯🇵',
        subtitle: 'ひらがな · カタカナ',
    },
    {
        id: Languages.th,
        code: 'th',
        glyph: 'ก',
        flag: '🇹🇭',
        subtitle: 'ก – ฮ',
    },
    {
        id: Languages.zh,
        code: 'zh',
        glyph: '字',
        flag: '🇨🇳',
        subtitle: '汉字',
    },
    {
        id: Languages.ko,
        code: 'ko',
        glyph: '한',
        flag: '🇰🇷',
        subtitle: '한글',
    },
    {
        id: Languages.other,
        code: 'other',
        glyph: OTHER_GLYPH,
        flag: OTHER_GLYPH,
        subtitle: OTHER_GLYPH,
    },
];

/** The config entry for a target language, or `undefined` if unknown. */
export function targetLanguage(id: Languages): AvailableLanguage | undefined {
    return languages.find((language) => language.id === id);
}
