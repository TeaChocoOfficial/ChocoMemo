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
}

export type Language = Languages[keyof Languages];

/** Whether a target language is ready to study or still being built. */
export type TargetStatus = 'ready' | 'coming-soon';

/** The character set a target language teaches, when it has one yet. */
export type CharacterSetId = 'kana' | 'alphabet' | 'hangul' | 'hanzi' | 'thai';

/**
 * One target language's capabilities. This is the single config the menus, the
 * hub and the character routes read, so a language's readiness and its
 * character set are declared once instead of per route file.
 */
export interface AvailableLanguage {
    id: Languages;
    /** Short code used in the URL (`?target=ja`). */
    code: string;
    glyph: string;
    status: TargetStatus;
    /** Absent when the language has no character chart yet. */
    characterSet?: CharacterSetId;
}

export const languages: AvailableLanguage[] = [
    {
        id: Languages.en,
        code: 'en',
        glyph: 'A',
        status: 'ready',
    },
    {
        id: Languages.ja,
        code: 'ja',
        glyph: 'あ',
        status: 'ready',
        characterSet: 'kana',
    },
    {
        id: Languages.ko,
        code: 'ko',
        glyph: '한',
        status: 'coming-soon',
        characterSet: 'hangul',
    },
    {
        id: Languages.th,
        code: 'th',
        glyph: 'ก',
        status: 'coming-soon',
        characterSet: 'thai',
    },
    {
        id: Languages.zh,
        code: 'zh',
        glyph: '字',
        status: 'coming-soon',
        characterSet: 'hanzi',
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
