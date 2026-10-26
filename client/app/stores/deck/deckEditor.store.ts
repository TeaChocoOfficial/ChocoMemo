// -Path: 'client/app/stores/config/deckEditor.store.ts'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Languages } from '~/data/language';
import type { DeckFilter, DeckSource, DeckView } from '~/types/deck';

interface DeckEditorState {
    /** language -> the deck view last used on that track. */
    views: Partial<Record<Languages, DeckView>>;
    sources: Partial<Record<Languages, DeckSource>>;
    /** language -> the explorer filter last used on that track. */
    filters: Partial<Record<Languages, DeckFilter>>;
    /** language -> the deck id last selected on that track. */
    selections: Partial<Record<Languages, string | null>>;
    setView: (language: Languages, view: DeckView) => void;
    setSource: (language: Languages, source: DeckSource) => void;
    setFilter: (language: Languages, filter: DeckFilter) => void;
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
            views: {},
            sources: {},
            filters: {},
            selections: {},
            setView: (language, view) =>
                set((state) => ({ views: { ...state.views, [language]: view } })),
            setSource: (language, source) =>
                set((state) => ({ sources: { ...state.sources, [language]: source } })),
            setFilter: (language, filter) =>
                set((state) => ({ filters: { ...state.filters, [language]: filter } })),
            setSelection: (language, id) =>
                set((state) => ({ selections: { ...state.selections, [language]: id } })),
        }),
        {
            name: 'choco-memo-deck-editor',
        },
    ),
);
