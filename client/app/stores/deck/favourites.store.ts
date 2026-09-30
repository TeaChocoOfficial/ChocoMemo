// Local-first store for the decks a viewer has favourited.
//
// A favourite is private to the device: there is no server to share a like
// with, so this is a bookmark list, not a public count. The `heart` field on
// deck meta is left for when decks do come from a server with real numbers.
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined;

interface FavouritesState {
    /** Deck id -> favourited. A record rather than an array so a toggle costs
     *  one key write and the persisted shape cannot hold duplicates. */
    ids: Record<string, true>;
    /** Flips one deck's favourite state and returns the new value. */
    toggle: (deckId: string) => boolean;
    clear: () => void;
}

export const useFavouritesStore = create<FavouritesState>()(
    persist(
        (set, get) => ({
            ids: {},
            toggle: (deckId) => {
                const next = !get().ids[deckId];
                set((state) => {
                    const ids = { ...state.ids };
                    if (next) ids[deckId] = true;
                    else delete ids[deckId];
                    return { ids };
                });
                return next;
            },
            clear: () => set({ ids: {} }),
        }),
        {
            name: 'choco-memo-favourites',
            storage,
            partialize: (state) => ({ ids: state.ids }),
        },
    ),
);
