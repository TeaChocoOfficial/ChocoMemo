// -Path: 'client/app/stores/config/deckList.store.ts'
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_TARGET_LANG, type Languages } from '~/data/language';
import type { DeckDensity, DeckSort } from '~/types/deckList';

/** The deck-list options the viewer last set, remembered across visits. */
export interface DeckListOptions {
    /** The target language the deck list browses. */
    targetLang: Languages;
    sort: DeckSort;
    density: DeckDensity;
    /** Whether decks flagged `nsfw` are shown. */
    nsfw: boolean;
}

/** What a first-time viewer's deck list opens with. */
export const DEFAULT_DECK_LIST_OPTIONS: DeckListOptions = {
    targetLang: DEFAULT_TARGET_LANG,
    sort: 'default',
    density: 'comfortable',
    nsfw: false,
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
            save: (patch) => set(patch),
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
