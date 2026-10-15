// -Path: 'client/app/stores/config/deckList.store.ts'
import { create } from 'zustand';
import type { DeckDensity, DeckNsfwFilter, DeckSort } from '~/types/deckList';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_TARGET_LANG, type TargetFilter } from '~/data/language';

/** The deck-list options the viewer last set, remembered across visits. */
export interface DeckListOptions {
    /** The target language the deck list browses, or every language at once. */
    targetLang: TargetFilter;
    sort: DeckSort;
    density: DeckDensity;
    /** Which flagged decks the list shows: all, only flagged, or hide them. */
    nsfw: DeckNsfwFilter;
}

/** What a first-time viewer's deck list opens with. */
export const DEFAULT_DECK_LIST_OPTIONS: DeckListOptions = {
    targetLang: DEFAULT_TARGET_LANG,
    sort: 'default',
    density: 'comfortable',
    nsfw: 'hide',
};

interface DeckListState extends DeckListOptions {
    /** Merges a partial change into the saved options. */
    save: (patch: Partial<DeckListOptions>) => void;
}

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined;

/**
 * Persisted deck-list options. The URL still wins when it names a value, so a
 * shared link is honoured; this store fills the gaps, so a bare `/:lang/vocab`
 * opens the way the viewer last left it.
 */
export const useDeckListStore = create<DeckListState>()(
    persist(
        (set) => ({
            ...DEFAULT_DECK_LIST_OPTIONS,
            save: (patch) => set((state) => ({ ...state, ...patch })),
        }),
        {
            name: 'choco-memo-deck-list',
            storage,
            partialize: (state) => ({
                targetLang: state.targetLang,
                sort: state.sort,
                density: state.density,
                nsfw: state.nsfw,
            }),
        },
    ),
);
