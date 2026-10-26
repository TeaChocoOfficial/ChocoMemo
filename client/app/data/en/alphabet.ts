// -Path: 'client/app/data/en/alphabet.ts'
import type { OptionsItem, ReadableChar } from '~/types/characters';

/** The alphabet has two sets, mirroring kana's hiragana/katakana tabs. */
export type AlphabetSetId = 'uppercase' | 'lowercase';

/**
 * Uppercase letters in alphabetical order, the order learners actually meet
 * them in. `read` is the letter plus a mnemonic word that starts with it
 * (a ant, b bird, …), the same shape the Thai chart uses (กอ ไก่), and `sound`
 * follows the read so a generated clip speaks exactly what the card shows.
 */
const UPPERCASE: ReadableChar[] = [
    { char: 'A', read: 'a ant', sound: 'a-ant.mp3', image: '/en/image/a-ant.png' },
    { char: 'B', read: 'b bird', sound: 'b-bird.mp3', image: '/en/image/b-bird.png' },
    { char: 'C', read: 'c cat', sound: 'c-cat.mp3', image: '/en/image/c-cat.png' },
    { char: 'D', read: 'd dog', sound: 'd-dog.mp3', image: '/en/image/d-dog.png' },
    { char: 'E', read: 'e elephant', sound: 'e-elephant.mp3', image: '/en/image/e-elephant.png' },
    { char: 'F', read: 'f fish', sound: 'f-fish.mp3', image: '/en/image/f-fish.png' },
    { char: 'G', read: 'g goat', sound: 'g-goat.mp3', image: '/en/image/g-goat.png' },
    { char: 'H', read: 'h horse', sound: 'h-horse.mp3', image: '/en/image/h-horse.png' },
    { char: 'I', read: 'i igloo', sound: 'i-igloo.mp3', image: '/en/image/i-igloo.png' },
    { char: 'J', read: 'j jellyfish', sound: 'j-jellyfish.mp3', image: '/en/image/j-jellyfish.png' },
    { char: 'K', read: 'k kite', sound: 'k-kite.mp3', image: '/en/image/k-kite.png' },
    { char: 'L', read: 'l lion', sound: 'l-lion.mp3', image: '/en/image/l-lion.png' },
    { char: 'M', read: 'm monkey', sound: 'm-monkey.mp3', image: '/en/image/m-monkey.png' },
    { char: 'N', read: 'n nest', sound: 'n-nest.mp3', image: '/en/image/n-nest.png' },
    { char: 'O', read: 'o orange', sound: 'o-orange.mp3', image: '/en/image/o-orange.png' },
    { char: 'P', read: 'p pig', sound: 'p-pig.mp3', image: '/en/image/p-pig.png' },
    { char: 'Q', read: 'q queen', sound: 'q-queen.mp3', image: '/en/image/q-queen.png' },
    { char: 'R', read: 'r rabbit', sound: 'r-rabbit.mp3', image: '/en/image/r-rabbit.png' },
    { char: 'S', read: 's sun', sound: 's-sun.mp3', image: '/en/image/s-sun.png' },
    { char: 'T', read: 't tiger', sound: 't-tiger.mp3', image: '/en/image/t-tiger.png' },
    { char: 'U', read: 'u umbrella', sound: 'u-umbrella.mp3', image: '/en/image/u-umbrella.png' },
    { char: 'V', read: 'v violin', sound: 'v-violin.mp3', image: '/en/image/v-violin.png' },
    { char: 'W', read: 'w whale', sound: 'w-whale.mp3', image: '/en/image/w-whale.png' },
    { char: 'X', read: 'x xylophone', sound: 'x-xylophone.mp3', image: '/en/image/x-xylophone.png' },
    { char: 'Y', read: 'y yoyo', sound: 'y-yoyo.mp3', image: '/en/image/y-yoyo.png' },
    { char: 'Z', read: 'z zebra', sound: 'z-zebra.mp3', image: '/en/image/z-zebra.png' },
];

/** Lowercase is derived, so a read is only ever written once. */
const LOWERCASE: ReadableChar[] = UPPERCASE.map(({ char, read, sound, image }) => ({
    char: char.toLowerCase(),
    read,
    sound,
    image,
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
