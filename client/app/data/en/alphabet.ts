// -Path: 'client/app/data/en/alphabet.ts'
import type { OptionsItem, ReadableChar } from '~/types/characters';

/** The alphabet has two sets, mirroring kana's hiragana/katakana tabs. */
export type AlphabetSetId = 'uppercase' | 'lowercase';

/** Uppercase letters in alphabetical order, the order learners actually meet them in. */
const UPPERCASE: ReadableChar[] = [
    { char: 'A', read: 'ay', sound: 'ay.mp3' },
    { char: 'B', read: 'bee', sound: 'bee.mp3' },
    { char: 'C', read: 'see', sound: 'see.mp3' },
    { char: 'D', read: 'dee', sound: 'dee.mp3' },
    { char: 'E', read: 'ee', sound: 'ee.mp3' },
    { char: 'F', read: 'ef', sound: 'ef.mp3' },
    { char: 'G', read: 'jee', sound: 'jee.mp3' },
    { char: 'H', read: 'aitch', sound: 'aitch.mp3' },
    { char: 'I', read: 'eye', sound: 'eye.mp3' },
    { char: 'J', read: 'jay', sound: 'jay.mp3' },
    { char: 'K', read: 'kay', sound: 'kay.mp3' },
    { char: 'L', read: 'el', sound: 'el.mp3' },
    { char: 'M', read: 'em', sound: 'em.mp3' },
    { char: 'N', read: 'en', sound: 'en.mp3' },
    { char: 'O', read: 'oh', sound: 'oh.mp3' },
    { char: 'P', read: 'pee', sound: 'pee.mp3' },
    { char: 'Q', read: 'kyoo', sound: 'kyoo.mp3' },
    { char: 'R', read: 'ar', sound: 'ar.mp3' },
    { char: 'S', read: 'ess', sound: 'ess.mp3' },
    { char: 'T', read: 'tee', sound: 'tee.mp3' },
    { char: 'U', read: 'you', sound: 'you.mp3' },
    { char: 'V', read: 'vee', sound: 'vee.mp3' },
    { char: 'W', read: 'double-you', sound: 'double-you.mp3' },
    { char: 'X', read: 'eks', sound: 'eks.mp3' },
    { char: 'Y', read: 'why', sound: 'why.mp3' },
    { char: 'Z', read: 'zee', sound: 'zee.mp3' },
];

/** Lowercase is derived, so a read is only ever written once. */
const LOWERCASE: ReadableChar[] = UPPERCASE.map(({ char, read, sound }) => ({
    char: char.toLowerCase(),
    read,
    sound,
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
