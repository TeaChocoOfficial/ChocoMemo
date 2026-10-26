import type { LangCode } from '~/data/language';
import type { AlphabetSetId } from '~/data/en/alphabet';
import type { KanaChars, KanaSetId } from '~/data/ja/kana';
import type { ThaiGroupId, ThaiSetId } from '~/data/th/thai';

export type CharLang = Exclude<LangCode, 'other'>;

/** The English chart's group tabs: vowels and consonants. */
export type LetterGroupId = 'consonants' | 'vowels';

export interface ReadableChar {
    char: string;
    read: string;
    // sound: such as 'ko-kai.mp3'
    sound: string;
    /** The card's picture, e.g. `/th/image/ko-kai.png`; empty when the chart has none. */
    image: string;
}

export interface ActiveSet extends Record<CharLang, string> {
    en: AlphabetSetId;
    ja: KanaSetId;
    th: ThaiSetId;
}

export interface ActiveGroups extends Record<CharLang, string> {
    en: LetterGroupId;
    ja: keyof KanaChars;
    th: ThaiGroupId;
}

export type OptionsItem<Lang extends CharLang> = Record<
    ActiveSet[Lang],
    Record<ActiveGroups[Lang], ReadableChar[]>
>;

export type OptionItem<Lang extends CharLang> =
    OptionsItem<Lang>[ActiveSet[Lang]][ActiveGroups[Lang]];
