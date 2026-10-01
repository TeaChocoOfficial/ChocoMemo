// Server-backed cache for decks published by other users.
//
// Read-only from the viewer's side: these can be browsed and downloaded but not
// edited, which is what separates them from the cloud store holding the
// viewer's own synced decks. In-memory only, and rehydrated on demand so
// localStorage never goes stale relative to the server.
import { create } from 'zustand';
import deckAPI from '~/services/deck';
import { Languages } from '~/data/language';
import type { DeckData, DeckLists, DeckListStatus } from '~/types/deck';
import { PAGE_SIZE } from '~/constants/deckList';

interface DeckListCommunityState {
    /** language id -> community decks in that language. */
    deckLists: DeckLists;
    status: Partial<Record<Languages, DeckListStatus>>;
    error: Partial<Record<Languages, string>>;
    /** language id -> the cursor for the next page, or `null` at the end. */
    nextCursor: Partial<Record<Languages, string | null>>;
    /** Loads the first page of community decks for a language.
     *
     *  Fails soft — an error status and an empty list — so a page still renders
     *  when the API is down, and the error state can say so. */
    fetchDecks: (language: Languages) => Promise<void>;
    /** Appends the next page. A no-op once the end has been reached, so a
     *  scroll that fires repeatedly cannot loop. */
    fetchMore: (language: Languages) => Promise<void>;
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

/** An axios error's message is usually "Request failed with status code 404",
 *  which tells a reader nothing. The API's own `message` does. */
const errorMessage = (error: unknown): string => {
    const fromBody = (error as { response?: { data?: { message?: unknown } } })?.response?.data
        ?.message;
    if (typeof fromBody === 'string') return fromBody;
    if (Array.isArray(fromBody) && fromBody.length > 0) return String(fromBody[0]);
    return error instanceof Error ? error.message : 'Failed to load decks.';
};

export const useDeckListCommunityStore = create<DeckListCommunityState>((set, get) => ({
    deckLists: {},
    status: {},
    error: {},
    nextCursor: {},

    fetchDecks: async (language) => {
        set((state) => ({ status: { ...state.status, [language]: 'loading' } }));
        try {
            const page = await deckAPI.page({ language, limit: PAGE_SIZE }, 'community');
            set((state) => ({
                ...withDecks(state, language, page.decks),
                status: { ...state.status, [language]: 'ready' },
                error: { ...state.error, [language]: undefined },
                nextCursor: { ...state.nextCursor, [language]: page.nextCursor },
            }));
        } catch (error) {
            set((state) => ({
                deckLists: { ...state.deckLists, [language]: [] },
                status: { ...state.status, [language]: 'error' },
                error: { ...state.error, [language]: errorMessage(error) },
                nextCursor: { ...state.nextCursor, [language]: null },
            }));
        }
    },

    fetchMore: async (language) => {
        const cursor = get().nextCursor[language];
        // No cursor means the last page has been read; asking again would just
        // re-fetch the final page forever.
        if (!cursor) return;
        try {
            const page = await deckAPI.page({ language, limit: PAGE_SIZE, cursor }, 'community');
            set((state) => ({
                ...withDecks(state, language, [
                    ...(state.deckLists[language] ?? []),
                    ...page.decks,
                ]),
                nextCursor: { ...state.nextCursor, [language]: page.nextCursor },
            }));
        } catch (error) {
            set((state) => ({
                error: { ...state.error, [language]: errorMessage(error) },
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

    clear: () => set({ deckLists: {}, status: {}, error: {}, nextCursor: {} }),
}));

/** Community decks for a language. */
export function communityDecks(language: Languages): DeckData[] {
    return useDeckListCommunityStore.getState().deckLists[language] ?? [];
}
