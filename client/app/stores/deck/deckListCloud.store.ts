// Server-backed cache for the decks a user has synced to their account.
//
// In-memory only: it mirrors what the API returns and is rehydrated on demand,
// so localStorage never goes stale relative to the server. The local
// counterpart is `deckListLocal.store.ts`; decks published by other users
// live in `deckListCommunity.store.ts`.
import { create } from 'zustand';
import { Languages } from '~/data/language';
import type { DeckData, DeckLists } from '~/types/deck';

export type DeckListStatus = 'idle' | 'loading' | 'ready' | 'error';

interface DeckListCloudState {
    /** language id -> the user's synced decks in that language. */
    deckLists: DeckLists;
    status: Partial<Record<Languages, DeckListStatus>>;
    error: Partial<Record<Languages, string>>;
    /**
     * Loads the user's synced decks for a language.
     *
     * @todo There is no deck endpoint yet (`server/src/api` has only img,
     * socket and user), so this is not wired to a URL. It is written to fail
     * soft — resolving to an error status and an empty list rather than an
     * unhandled rejection — so pages render now and the endpoint can be
     * dropped in without touching callers.
     */
    fetchDecks: (language: Languages) => Promise<void>;
    setDecks: (language: Languages, decks: DeckData[]) => void;
    upsertDeck: (language: Languages, deck: DeckData) => void;
    /** Detaches a deck from the account. The local copy is unaffected. */
    removeDeck: (language: Languages, id: string) => void;
    clear: () => void;
}

/** Replace one language's list without touching the others. */
const withDecks = (
    state: DeckListCloudState,
    language: Languages,
    decks: DeckData[],
): Pick<DeckListCloudState, 'deckLists'> => ({
    deckLists: { ...state.deckLists, [language]: decks },
});

export const useDeckListCloudStore = create<DeckListCloudState>((set) => ({
    deckLists: {},
    status: {},
    error: {},

    fetchDecks: async (language) => {
        set((state) => ({ status: { ...state.status, [language]: 'loading' } }));
        try {
            // @todo Replace with the real deck endpoint once it exists.
            const decks: DeckData[] = [];
            set((state) => ({
                ...withDecks(state, language, decks),
                status: { ...state.status, [language]: 'ready' },
                error: { ...state.error, [language]: undefined },
            }));
        } catch (error) {
            set((state) => ({
                deckLists: { ...state.deckLists, [language]: [] },
                status: { ...state.status, [language]: 'error' },
                error: {
                    ...state.error,
                    [language]: error instanceof Error ? error.message : 'Failed to load decks.',
                },
            }));
        }
    },

    setDecks: (language, decks) =>
        set((state) => ({
            ...withDecks(state, language, decks),
            status: { ...state.status, [language]: 'ready' },
        })),

    upsertDeck: (language, deck) =>
        set((state) => {
            const current = state.deckLists[language] ?? [];
            const exists = current.some((d) => d.id === deck.id);
            return withDecks(
                state,
                language,
                exists ? current.map((d) => (d.id === deck.id ? deck : d)) : [...current, deck],
            );
        }),

    removeDeck: (language, id) =>
        set((state) =>
            withDecks(
                state,
                language,
                (state.deckLists[language] ?? []).filter((deck) => deck.id !== id),
            ),
        ),

    clear: () => set({ deckLists: {}, status: {}, error: {} }),
}));

/** The user's synced decks for a language. */
export function cloudDecks(language: Languages): DeckData[] {
    return useDeckListCloudStore.getState().deckLists[language] ?? [];
}
