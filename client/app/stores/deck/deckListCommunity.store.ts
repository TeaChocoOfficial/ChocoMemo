// Server-backed cache for decks published by other users.
//
// Read-only from the viewer's side: these can be browsed and downloaded but not
// edited, which is what separates them from the cloud store holding the
// viewer's own synced decks. In-memory only, and rehydrated on demand so
// localStorage never goes stale relative to the server.
import { create } from 'zustand';
import type { DeckData, DeckLists } from '~/types/deck';
import { Languages } from '~/data/language';

export type DeckListStatus = 'idle' | 'loading' | 'ready' | 'error';

interface DeckListCommunityState {
    /** language id -> community decks in that language. */
    deckLists: DeckLists;
    status: Partial<Record<Languages, DeckListStatus>>;
    error: Partial<Record<Languages, string>>;
    /**
     * Loads community decks for a language.
     *
     * @todo There is no deck endpoint yet, so this is not wired to a URL. It
     * fails soft — an error status and an empty list — so the tab renders
     * instead of throwing until the endpoint exists.
     */
    fetchDecks: (language: Languages) => Promise<void>;
    setDecks: (language: Languages, decks: DeckData[]) => void;
    upsertDeck: (language: Languages, deck: DeckData) => void;
    /** @todo Needs auth to be meaningful; unscoped removals are not exposed
     *  while there is no backend to enforce ownership. */
    clear: () => void;
}

const withDecks = (
    state: DeckListCommunityState,
    language: Languages,
    decks: DeckData[],
): Pick<DeckListCommunityState, 'deckLists'> => ({
    deckLists: { ...state.deckLists, [language]: decks },
});

export const useDeckListCommunityStore = create<DeckListCommunityState>((set) => ({
    deckLists: {},
    status: {},
    error: {},

    fetchDecks: async (language) => {
        set((state) => ({ status: { ...state.status, [language]: 'loading' } }));
        try {
            // @todo Replace with the real community endpoint once it exists.
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

    clear: () => set({ deckLists: {}, status: {}, error: {} }),
}));

/** Community decks for a language. */
export function communityDecks(language: Languages): DeckData[] {
    return useDeckListCommunityStore.getState().deckLists[language] ?? [];
}
