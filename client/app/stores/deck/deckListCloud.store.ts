// Server-backed cache for the decks a user has synced to their account.
//
// In-memory only: it mirrors what the API returns and is rehydrated on demand,
// so localStorage never goes stale relative to the server. The local
// counterpart is `deckListLocal.store.ts`; decks published by other users
// live in `deckListCommunity.store.ts`.
import { create } from 'zustand';
import deckAPI from '~/services/deck';
import { Languages } from '~/data/language';
import type { DeckData, DeckLists, DeckListStatus } from '~/types/deck';
import { PAGE_SIZE } from '~/constants/deckList';

/** The API's error for a missing or rejected session. */
const NO_SESSION = 401;

interface DeckListCloudState {
    /** language id -> the user's synced decks in that language. */
    deckLists: DeckLists;
    status: Partial<Record<Languages, DeckListStatus>>;
    error: Partial<Record<Languages, string>>;
    /** language id -> the cursor for the next page, or `null` at the end. */
    nextCursor: Partial<Record<Languages, string | null>>;
    /**
     * Loads the caller's own decks for a language, in every visibility —
     * `cursor: 'mine'` rather than the public browse.
     *
     * Fails soft — an error status and an empty list — so a page still renders
     * when the API is down or the viewer is signed out.
     */
    fetchDecks: (language: Languages) => Promise<void>;
    /** Appends the next page. A no-op once the end has been reached. */
    fetchMore: (language: Languages) => Promise<void>;
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

/** An axios message like "Request failed with status code 404" tells a
 *  reader nothing; the API's own `message` does. */
const errorMessage = (error: unknown, signedOut: boolean): string => {
    if (signedOut) return 'Sign in to see your decks on this device.';
    const fromBody = (error as { response?: { data?: { message?: unknown } } })?.response?.data
        ?.message;
    if (typeof fromBody === 'string') return fromBody;
    if (Array.isArray(fromBody) && fromBody.length > 0) return String(fromBody[0]);
    return error instanceof Error ? error.message : 'Failed to load decks.';
};

const isUnauthorized = (error: unknown): boolean =>
    (error as { response?: { status?: number } })?.response?.status === NO_SESSION;

export const useDeckListCloudStore = create<DeckListCloudState>((set, get) => ({
    deckLists: {},
    status: {},
    error: {},
    nextCursor: {},

    fetchDecks: async (language) => {
        set((state) => ({ status: { ...state.status, [language]: 'loading' } }));
        try {
            const page = await deckAPI.page(
                { language, cursor: 'mine', limit: PAGE_SIZE },
                'cloud',
            );
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
                error: {
                    ...state.error,
                    [language]: errorMessage(error, isUnauthorized(error)),
                },
                nextCursor: { ...state.nextCursor, [language]: null },
            }));
        }
    },

    fetchMore: async (language) => {
        const cursor = get().nextCursor[language];
        if (!cursor) return;
        try {
            const page = await deckAPI.page({ language, cursor, limit: PAGE_SIZE }, 'cloud');
            set((state) => ({
                ...withDecks(state, language, [
                    ...(state.deckLists[language] ?? []),
                    ...page.decks,
                ]),
                nextCursor: { ...state.nextCursor, [language]: page.nextCursor },
            }));
        } catch (error) {
            set((state) => ({
                error: { ...state.error, [language]: errorMessage(error, false) },
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

    clear: () => set({ deckLists: {}, status: {}, error: {}, nextCursor: {} }),
}));

/** The user's synced decks for a language. */
export function cloudDecks(language: Languages): DeckData[] {
    return useDeckListCloudStore.getState().deckLists[language] ?? [];
}
