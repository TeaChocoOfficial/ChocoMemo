// -Path: 'client/app/stores/config/deckEditor.store.ts'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeckType } from '~/types/deck';
import type { Languages } from '~/data/language';

/** Explorer filter: one editable deck type, or `all` for the whole collection.
 *  `drill` is excluded because it has no rail entry to select it. */
export type DeckFilter = 'all' | Exclude<DeckType, 'drill'>;

/** Which slice of the collection the explorer is showing. */
export type DeckView = 'all' | 'favourites' | 'recent';

interface DeckEditorState {
    /** language -> the explorer filter last used on that track. */
    filters: Partial<Record<Languages, DeckFilter>>;
    /** language -> the deck view last used on that track. */
    views: Partial<Record<Languages, DeckView>>;
    /** language -> the deck id last selected on that track. */
    selections: Partial<Record<Languages, string | null>>;
    setFilter: (language: Languages, filter: DeckFilter) => void;
    setView: (language: Languages, view: DeckView) => void;
    setSelection: (language: Languages, id: string | null) => void;
}

/**
 * Persisted, per-track UI state for the deck editor: which filter is active and
 * which deck is selected. Kept out of `useDeckEditor`'s local state, and stored
 * beside the dockview layout and theme, so the editor reopens on the same deck
 * after a reload.
 */
export const useDeckEditorStore = create<DeckEditorState>()(
    persist(
        (set) => ({
            filters: {},
            views: {},
            selections: {},
            setFilter: (language, filter) =>
                set((state) => ({ filters: { ...state.filters, [language]: filter } })),
            setView: (language, view) =>
                set((state) => ({ views: { ...state.views, [language]: view } })),
            setSelection: (language, id) =>
                set((state) => ({ selections: { ...state.selections, [language]: id } })),
        }),
        {
            name: 'choco-memo-deck-editor',
        },
    ),
);
