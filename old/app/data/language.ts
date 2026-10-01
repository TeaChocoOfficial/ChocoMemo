export enum Languages {
    en = 'english',
    ja = 'japanese',
    ko = 'korean',
    th = 'thai',
    zh = 'chinese',
}

export type Language = Languages[keyof Languages];

export interface AvailableLanguage {
    id: Languages;
    code: string;
    glyph: string;
    available: boolean;
}

export const languages: AvailableLanguage[] = [
    {
        id: Languages.en,
        code: 'en',
        glyph: 'A',
        available: true,
    },
    {
        id: Languages.ja,
        code: 'ja',
        glyph: 'あ',
        available: true,
    },
    {
        id: Languages.ko,
        code: 'ko',
        glyph: '한',
        available: false,
    },
    {
        id: Languages.th,
        code: 'th',
        glyph: 'ก',
        available: false,
    },
    {
        id: Languages.zh,
        code: 'zh',
        glyph: '字',
        available: false,
    },
];
