// -Path: 'client/app/data/japanese/decks.ts'
import type { DeckData } from '~/types/deck';
import { shippedDeckMeta } from '~/utils/deckMeta';
import { DEFAULT_VOCABULARY } from '../japanese/vocabulary';

/**
 * Built-in themed decks derived from DEFAULT_VOCABULARY.
 * Each deck references a slice of the default words by id, so the word
 * data stays in vocabulary.ts (the single source of truth) while decks
 * only describe grouping + metadata.
 *
 * They ship with the app rather than being the viewer's own, so they are
 * `official` sourced: reviewable by everyone, editable by no one.
 *
 * Deck ids are stable ("deck-nature", ...). They appear under
 * /japanese/review/:deck-id.
 */

const NATURE = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8'];
const ANIMALS = ['v9', 'v10', 'v11', 'v12'];
const THINGS = ['v13', 'v14', 'v15', 'v16', 'v17'];
const ACTIONS = ['v18', 'v19', 'v20'];

export const DEFAULT_DECKS: DeckData[] = [
    {
        id: 'deck-nature',
        name: 'Nature',
        description: 'Water, fire, mountains — the natural world in kanji.',
        source: 'official',
        type: 'vocab',
        image: 'https://images.unsplash.com/photo-1609607726501-5f6e756a3b6a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bnV0dXJlfGVufDB8fDB8fHww',
        contentIds: NATURE,
        tags: ['nature'],
        nsfw: false,
        meta: shippedDeckMeta(),
    },
    {
        id: 'deck-animals',
        name: 'Animals',
        description: 'Dogs, cats, birds and fish to get you started.',
        source: 'official',
        type: 'vocab',
        contentIds: ANIMALS,
        tags: ['animals'],
        nsfw: false,
        meta: shippedDeckMeta(),
    },
    {
        id: 'deck-things',
        name: 'Everyday Things',
        description: 'Books, trains, school and friends — daily-life essentials.',
        source: 'official',
        type: 'vocab',
        contentIds: THINGS,
        tags: ['everyday'],
        nsfw: false,
        meta: shippedDeckMeta(),
    },
    {
        id: 'deck-actions',
        name: 'Actions',
        description: 'Eating, drinking, going — common everyday verbs.',
        source: 'official',
        type: 'vocab',
        contentIds: ACTIONS,
        tags: ['actions'],
        nsfw: false,
        meta: shippedDeckMeta(),
    },
];

/** Resolve the words for any deck from the default set. */
export function wordsForDeck(deck: DeckData) {
    if (deck.source === 'official') {
        return deck.contentIds
            .map((id) => DEFAULT_VOCABULARY.find((w) => w.id === id))
            .filter((w): w is (typeof DEFAULT_VOCABULARY)[number] => w != null);
    }
    return [];
}

/** Look up a deck by id across the default set. */
export function findDefaultDeck(id: string): DeckData | undefined {
    return DEFAULT_DECKS.find((d) => d.id === id);
}
