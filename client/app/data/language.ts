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

export type Language = Languages[keyof Languages];

/** Whether a target language, or one of its features, is ready or still built. */
export type TargetStatus = 'ready' | 'coming-soon';

/** The character set a target language teaches, when it has one yet. */
export type CharacterSetId = 'kana' | 'alphabet' | 'hangul' | 'hanzi' | 'thai';

/** Glyph for the catch-all "Another language" target. Declared once so the
 *  switcher and the Landing read the same mark. */
export const OTHER_GLYPH = '🌐';

/** The target a deck list browses when no `?target=` is present. */
export const DEFAULT_TARGET_LANG = Languages.ja;

/** A target language's character chart, when it has one. */
export interface CharacterSetConfig {
    /** Route set id, e.g. `kana`. */
    id: CharacterSetId;
    /** Large script glyph for the tile, e.g. あ or Aa. */
    glyph: string;
    /** Chart name, e.g. "Kana". */
    name: string;
    /** Scripts/count subtitle, e.g. "ひらがな · カタカナ". */
    subtitle: string;
    status: TargetStatus;
}

/** A target language's character drill, when it has one. */
export interface DrillConfig {
    /** Small language badge shown on the row, e.g. 日 or En. */
    badge: string;
    /** Drill name, e.g. "Kana Drill". */
    name: string;
    /** One-line description of what the drill does. */
    description: string;
    status: TargetStatus;
}

/**
 * One target language's capabilities. This is the single config the menus, the
 * study hub and the character routes read, so a language's glyph, its
 * character chart and its drill are declared once instead of per component.
 */
export interface AvailableLanguage {
    id: Languages;
    /** Short code used in the URL (`?target=ja`). */
    code: string;
    glyph: string;
    status: TargetStatus;
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
        status: 'ready',
        characters: {
            id: 'alphabet',
            glyph: 'Aa',
            name: 'Alphabet',
            subtitle: 'A – Z',
            status: 'coming-soon',
        },
        drill: {
            badge: 'En',
            name: 'Alphabet Drill',
            description: 'Timed multiple choice over the English alphabet.',
            status: 'coming-soon',
        },
    },
    {
        id: Languages.ja,
        code: 'ja',
        glyph: 'あ',
        status: 'ready',
        characters: {
            id: 'kana',
            glyph: 'あ',
            name: 'Kana',
            subtitle: 'ひらがな · カタカナ',
            status: 'ready',
        },
        drill: {
            badge: '日',
            name: 'Kana Drill',
            description: 'Timed multiple choice over hiragana and katakana.',
            status: 'ready',
        },
    },
    {
        id: Languages.th,
        code: 'th',
        glyph: 'ก',
        status: 'coming-soon',
        characters: {
            id: 'thai',
            glyph: 'ก',
            name: 'Thai',
            subtitle: 'ก – ฮ',
            status: 'coming-soon',
        },
        drill: {
            badge: 'ก',
            name: 'Thai Drill',
            description: 'Timed multiple choice over the Thai script.',
            status: 'coming-soon',
        },
    },
    {
        id: Languages.zh,
        code: 'zh',
        glyph: '字',
        status: 'coming-soon',
        characters: {
            id: 'hanzi',
            glyph: '汉',
            name: 'Hanzi',
            subtitle: '汉字',
            status: 'coming-soon',
        },
        drill: {
            badge: '中',
            name: 'Hanzi Drill',
            description: 'Timed multiple choice over the Hanzi characters.',
            status: 'coming-soon',
        },
    },
    {
        id: Languages.ko,
        code: 'ko',
        glyph: '한',
        status: 'coming-soon',
        characters: {
            id: 'hangul',
            glyph: '한',
            name: 'Hangul',
            subtitle: '한글',
            status: 'coming-soon',
        },
        drill: {
            badge: '한',
            name: 'Hangul Drill',
            description: 'Timed multiple choice over the Hangul syllable blocks.',
            status: 'coming-soon',
        },
    },
    {
        id: Languages.other,
        code: 'other',
        glyph: OTHER_GLYPH,
        status: 'ready',
    },
];

/** The config entry for a target language, or `undefined` if unknown. */
export function targetLanguage(id: Languages): AvailableLanguage | undefined {
    return languages.find((language) => language.id === id);
}

/** True when a target language is ready to study. */
export function isTargetReady(id: Languages): boolean {
    return targetLanguage(id)?.status === 'ready';
}
