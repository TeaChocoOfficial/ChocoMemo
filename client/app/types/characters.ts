import type { LangCode, Languages } from '~/data/language';
import type { AlphabetSetId } from '~/data/en/alphabet';
import type { KanaChars, KanaSetId } from '~/data/ja/kana';
import type { LetterGroupId } from '~/hooks/characters/useAlphabetReader';

export type CharLang = Exclude<LangCode, 'other'>;

export interface ReadableChar {
    char: string;
    read: string;
}

export interface ActiveSet extends Record<CharLang, string> {
    en: AlphabetSetId;
    ja: KanaSetId;
}

export interface ActiveGroups extends Record<CharLang, string> {
    en: LetterGroupId;
    ja: keyof KanaChars;
}

export type OptionsItem<Lang extends CharLang> = Record<
    ActiveSet[Lang],
    Record<ActiveGroups[Lang], ReadableChar[]>
>;

export type OptionItem<Lang extends CharLang> =
    OptionsItem<Lang>[ActiveSet[Lang]][ActiveGroups[Lang]];
