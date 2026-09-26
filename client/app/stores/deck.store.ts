// Local-first store for user vocabulary decks.
// Default decks are built-in and read-only; user decks live in
// localStorage and can be created from custom words, or (in the future)
// synced from cloud data or downloaded from other users.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_DECKS, findDefaultDeck } from '~/data/japanese/decks';
import type { VocabWord } from '~/types/vocabulary';
import { importedDeckSchema } from '~/utils/deck';
import { useVocabularyStore } from './vocabulary.store';
import type { DeckData } from '~/types/type';

interface DeckState {
    /** User-created / downloaded decks, persisted to localStorage. */
    userDecks: DeckData[];
    addDeck: (deck: DeckData) => void;
    removeDeck: (id: string) => void;
    clearDecks: () => void;
    /** Parses + validates a raw JSON payload (already JSON.parse'd) and adds
     *  it as a user deck. Returns an error message on failure instead of
     *  throwing, so the UI can show it inline. */
    importDeck: (raw: unknown) => { success: true } | { success: false; error: string };
}

function newDeckId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined;

export const useDeckStore = create<DeckState>()(
    persist(
        (set, get) => ({
            userDecks: [],
            addDeck: (deck) =>
                set((state) => {
                    const exists = state.userDecks.some((d) => d.id === deck.id);
                    if (exists) return state;
                    return { userDecks: [...state.userDecks, deck] };
                }),
            removeDeck: (id) =>
                set((state) => ({
                    userDecks: state.userDecks.filter((d) => d.id !== id),
                })),
            clearDecks: () => set({ userDecks: [] }),

            importDeck: (raw) => {
                const result = importedDeckSchema.safeParse(raw);
                if (!result.success) {
                    return { success: false, error: 'This file is not a valid deck.' };
                }

                const deck: DeckData = {
                    id: newDeckId(),
                    source: 'local',
                    ...result.data,
                };
                set((state) => ({ userDecks: [...state.userDecks, deck] }));
                return { success: true };
            },
        }),
        {
            name: 'choco-vocabulary-decks',
            storage,
            partialize: (state) => ({ userDecks: state.userDecks }),
        },
    ),
);

/** A "My words" deck built from the user's custom vocabulary, kept in
 *  sync with vocabulary.store. Always present so local words are reviewable. */
export function myWordsDeck(): DeckData | null {
    const custom = useVocabularyStore.getState().custom;
    if (custom.length === 0) return null;
    return {
        id: 'deck-my-words',
        name: 'My Words',
        description: 'All vocabulary you added yourself.',
        source: 'local',
        wordIds: custom.map((w: VocabWord) => w.id),
    };
}

/** All decks available for review: default + user (incl. my words) +
 *  cloud/downloaded placeholders. */
export function allDecks(): DeckData[] {
    const defaults = DEFAULT_DECKS;
    const myWords = myWordsDeck();
    const userDecks = useDeckStore.getState().userDecks;
    const list = myWords ? [myWords, ...userDecks] : userDecks;
    return [...defaults, ...list];
}

/** Resolve the words associated with a deck across all sources. */
export function deckWords(deck: DeckData): VocabWord[] {
    if (deck.source === 'default') {
        return deck.wordIds
            .map((id) =>
                useVocabularyStore
                    .getState()
                    .all()
                    .find((w) => w.id === id),
            )
            .filter((w): w is VocabWord => w != null);
    }
    if (deck.source === 'local') {
        return useVocabularyStore
            .getState()
            .all()
            .filter((w) => deck.wordIds.includes(w.id));
    }
    // cloud / downloaded decks with embedded words are a future server feature.
    return [];
}

/** Look up any deck (default or user) by id. */
export function findDeck(id: string): DeckData | undefined {
    return findDefaultDeck(id) ?? allDecks().find((d) => d.id === id);
}

/** Total word count across a deck. */
export function deckWordCount(deck: DeckData): number {
    return deck.wordIds.length;
}
