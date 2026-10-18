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

/** A target language's character chart, when it has one. */
export interface CharacterSetConfig {
    /** Large script glyph for the tile, e.g. あ or Aa. */
    glyph: string;
    /** Scripts/count subtitle, e.g. "ひらがな · カタカナ". */
    subtitle: string;
}

/** A target language's character drill, when it has one. */
export interface DrillConfig {
    /** Small language badge shown on the row, e.g. 日 or En. */
    badge: string;
    /** i18n key for the one-line description, e.g. `study.drill.items.ja.description`. */
    description: string;
}

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
    /** The character chart, when this language has one. */
    characters?: CharacterSetConfig;
    /** The character drill, when this language has one. */
    drill?: DrillConfig;
}

export const languages: AvailableLanguage[] = [
    {
        id: Languages.en,
        code: 'en',
        glyph: 'A',
        flag: '🇺🇸',
        characters: {
            glyph: 'Aa',
            subtitle: 'A – Z',
        },
        drill: {
            badge: 'En',
            description: 'study.drill.items.en.description',
        },
    },
    {
        id: Languages.ja,
        code: 'ja',
        glyph: 'あ',
        flag: '🇯🇵',
        characters: {
            glyph: 'あ',
            subtitle: 'ひらがな · カタカナ',
        },
        drill: {
            badge: '日',
            description: 'study.drill.items.ja.description',
        },
    },
    {
        id: Languages.th,
        code: 'th',
        glyph: 'ก',
        flag: '🇹🇭',
        characters: {
            glyph: 'ก',
            subtitle: 'ก – ฮ',
        },
        drill: {
            badge: 'ก',
            description: 'study.drill.items.th.description',
        },
    },
    {
        id: Languages.zh,
        code: 'zh',
        glyph: '字',
        flag: '🇨🇳',
        characters: {
            glyph: '汉',
            subtitle: '汉字',
        },
        drill: {
            badge: '中',
            description: 'study.drill.items.zh.description',
        },
    },
    {
        id: Languages.ko,
        code: 'ko',
        glyph: '한',
        flag: '🇰🇷',
        characters: {
            glyph: '한',
            subtitle: '한글',
        },
        drill: {
            badge: '한',
            description: 'study.drill.items.ko.description',
        },
    },
    {
        id: Languages.other,
        code: 'other',
        glyph: OTHER_GLYPH,
        flag: OTHER_GLYPH,
    },
];

/** The config entry for a target language, or `undefined` if unknown. */
export function targetLanguage(id: Languages): AvailableLanguage | undefined {
    return languages.find((language) => language.id === id);
}
