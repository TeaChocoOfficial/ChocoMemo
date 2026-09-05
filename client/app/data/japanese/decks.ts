// -Path: 'client/app/data/japanese/decks.ts'
import { DEFAULT_VOCABULARY } from './vocabulary';
import type { VocabDeck } from '~/types/vocabulary';

/**
 * Built-in themed decks derived from DEFAULT_VOCABULARY.
 * Each deck references a slice of the default words by id, so the word
 * data stays in vocabulary.ts (the single source of truth) while decks
 * only describe grouping + metadata.
 *
 * Deck ids are stable ("dex-nature", ...). They appear under
 * /japanese/vocabulary-review/:dex-id.
 */
const NATURE = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8'];
const ANIMALS = ['v9', 'v10', 'v11', 'v12'];
const THINGS = ['v13', 'v14', 'v15', 'v16', 'v17'];
const ACTIONS = ['v18', 'v19', 'v20'];

export const DEFAULT_DECKS: VocabDeck[] = [
    {
        id: 'dex-nature',
        name: 'Nature',
        description: 'Water, fire, mountains — the natural world in kanji.',
        source: 'default',
        wordIds: NATURE,
    },
    {
        id: 'dex-animals',
        name: 'Animals',
        description: 'Dogs, cats, birds and fish to get you started.',
        source: 'default',
        wordIds: ANIMALS,
    },
    {
        id: 'dex-things',
        name: 'Everyday Things',
        description: 'Books, trains, school and friends — daily-life essentials.',
        source: 'default',
        wordIds: THINGS,
    },
    {
        id: 'dex-actions',
        name: 'Actions',
        description: 'Eating, drinking, going — common everyday verbs.',
        source: 'default',
        wordIds: ACTIONS,
    },
];

/** Resolve the words for any deck from the default set. */
export function wordsForDeck(deck: VocabDeck) {
    if (deck.source === 'default') {
        return deck.wordIds
            .map((id) => DEFAULT_VOCABULARY.find((w) => w.id === id))
            .filter((w): w is (typeof DEFAULT_VOCABULARY)[number] => w != null);
    }
    return [];
}

/** Look up a deck by id across the default set. */
export function findDefaultDeck(id: string): VocabDeck | undefined {
    return DEFAULT_DECKS.find((d) => d.id === id);
}