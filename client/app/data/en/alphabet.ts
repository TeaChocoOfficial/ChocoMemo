// -Path: 'client/app/data/en/alphabet.ts'
import type { OptionsItem, ReadableChar } from '~/types/characters';

/** The alphabet has two sets, mirroring kana's hiragana/katakana tabs. */
export type AlphabetSetId = 'uppercase' | 'lowercase';

/** Uppercase letters in alphabetical order, the order learners actually meet them in. */
const UPPERCASE: ReadableChar[] = [
    { char: 'A', read: 'ay' },
    { char: 'B', read: 'bee' },
    { char: 'C', read: 'see' },
    { char: 'D', read: 'dee' },
    { char: 'E', read: 'ee' },
    { char: 'F', read: 'ef' },
    { char: 'G', read: 'jee' },
    { char: 'H', read: 'aitch' },
    { char: 'I', read: 'eye' },
    { char: 'J', read: 'jay' },
    { char: 'K', read: 'kay' },
    { char: 'L', read: 'el' },
    { char: 'M', read: 'em' },
    { char: 'N', read: 'en' },
    { char: 'O', read: 'oh' },
    { char: 'P', read: 'pee' },
    { char: 'Q', read: 'kyoo' },
    { char: 'R', read: 'ar' },
    { char: 'S', read: 'ess' },
    { char: 'T', read: 'tee' },
    { char: 'U', read: 'you' },
    { char: 'V', read: 'vee' },
    { char: 'W', read: 'double-you' },
    { char: 'X', read: 'eks' },
    { char: 'Y', read: 'why' },
    { char: 'Z', read: 'zee' },
];

/** Lowercase is derived, so a read is only ever written once. */
const LOWERCASE: ReadableChar[] = UPPERCASE.map(({ char, read }) => ({
    char: char.toLowerCase(),
    read,
}));

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

/**
 * True for the five vowel letters. `y` is deliberately not counted: it acts as
 * a vowel in words like "myth", so a drill that filters by vowel should treat
 * it as a judgement call rather than have it baked into the data.
 */
export function isVowel(letter: ReadableChar): boolean {
    return VOWELS.has(letter.char.toLowerCase());
}

/** Splits a flat A–Z list into the two reading groups the toolbar tabs show. */
const alphabetGroups = (letters: ReadableChar[]) => ({
    consonants: letters,
    vowels: letters.filter(isVowel),
});

/** The English alphabet per set, in A–Z order. */
export const ALPHABET_SETS: Record<AlphabetSetId, ReadableChar[]> = {
    uppercase: UPPERCASE,
    lowercase: LOWERCASE,
};

export const ALPHABET_CHARS: OptionsItem<'en'> = {
    uppercase: alphabetGroups(ALPHABET_SETS.uppercase),
    lowercase: alphabetGroups(ALPHABET_SETS.lowercase),
};
