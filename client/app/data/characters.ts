import { KANA_CHARS } from './ja/kana';
import { THAI_CHARS } from './th/thai';
import { ALPHABET_CHARS } from './en/alphabet';
import type { ActiveGroups, ActiveSet, CharLang, OptionsItem } from '~/types/characters';

export type CharacterToolOption<Lang extends CharLang> = {
    items: OptionsItem<Lang>;
    setId: ActiveSet[Lang][];
    groupId: ActiveGroups[Lang][];
};

export const characterToolOptions = {
    en: {
        items: ALPHABET_CHARS,
        setId: ['uppercase', 'lowercase'],
        groupId: ['consonants', 'vowels'],
    },
    ja: {
        items: KANA_CHARS,
        setId: ['hiragana', 'katakana'],
        groupId: ['voiceless', 'voiced', 'contracted'],
    },
    ko: {
        items: {},
        setId: [],
        groupId: [],
    },
    th: {
        items: THAI_CHARS,
        setId: ['consonants', 'vowels', 'tones'],
        groupId: ['headed', 'headless'],
    },
    zh: {
        items: {},
        setId: [],
        groupId: [],
    },
} satisfies {
    [Lang in CharLang]: CharacterToolOption<Lang>;
};

export type CharacterToolOptions = typeof characterToolOptions;
