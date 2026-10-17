// -Path: 'client/app/components/edit/useDeckEditor.ts'
import { useMemo } from 'react';
import { Languages } from '~/data/language';
import type { DeckData } from '~/types/deck';
import { useFavouritesStore } from '~/stores/deck/favourites.store';
import { useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';
import { useDeckEditorStore } from '~/stores/config/deckEditor.store';
import type { DeckFilter, DeckView } from '~/stores/config/deckEditor.store';

/** The editor surface `useDeckEditor` exposes to any language track. */
export interface DeckEditor {
    decks: DeckData[];
    selected: DeckData | null;
    selectedId: string | null;
    visibleDecks: DeckData[];
    typeFilter: DeckFilter;
    typeCounts: Record<DeckFilter, number>;
    /** Which slice of the collection the explorer shows. */
    view: DeckView;
    /** Removes the selected deck, or `id` when one is passed from a list row. */
    remove: (id?: string) => void;
    select: (id: string | null) => void;
    setTypeFilter: (value: DeckFilter) => void;
    setView: (value: DeckView) => void;
    reorder: (orderedIds: string[]) => void;
    update: (patch: Partial<DeckData>) => void;
}

/**
 * Editing state for one language's decks: the list ordered by `index`, the
 * explorer view and filter, the selection, and the mutations both panes need.
 * Ordering lives in the deck store; the view, the filter and the selection live
 * in the persisted `deckEditor` store, so this hook stays language-agnostic
 * while the editor still reopens where it left off.
 *
 * @param language - Track whose decks are being edited.
 * @returns Ordered decks, the view/filter, selection helpers, and actions.
 */
export function useDeckEditor(language: Languages): DeckEditor {
    const typeFilter = useDeckEditorStore((state) => state.filters[language] ?? 'all');
    const view = useDeckEditorStore((state) => state.views[language] ?? 'all');
    const selectedId = useDeckEditorStore((state) => state.selections[language] ?? null);
    const setFilter = useDeckEditorStore((state) => state.setFilter);
    const setViewStore = useDeckEditorStore((state) => state.setView);
    const setSelection = useDeckEditorStore((state) => state.setSelection);
    const favouriteIds = useFavouritesStore((state) => state.ids);
    const removeDeck = useDeckListLocalStore((state) => state.removeDeck);
    const updateDeck = useDeckListLocalStore((state) => state.updateDeck);
    const storedDecks = useDeckListLocalStore((state) => state.deckLists[language]);

    /** Store order is insertion order, so `index` is what the editor shows. */
    const decks = useMemo(
        () => [...(storedDecks ?? [])].sort((a, b) => a.index - b.index),
        [storedDecks],
    );

    /** The view narrows the collection; the type filter then narrows that. */
    const viewedDecks = useMemo(() => {
        if (view === 'favourites') return decks.filter((deck) => favouriteIds[deck.id]);
        if (view === 'recent') {
            return [...decks].sort((a, b) => b.meta.updatedAt.localeCompare(a.meta.updatedAt));
        }
        return decks;
    }, [decks, view, favouriteIds]);

    const visibleDecks = useMemo(
        () =>
            typeFilter === 'all'
                ? viewedDecks
                : viewedDecks.filter((deck) => deck.type === typeFilter),
        [viewedDecks, typeFilter],
    );

    /** Per-type totals for the filter, computed once per change. */
    const typeCounts = useMemo(() => {
        const counts: Record<DeckFilter, number> = {
            all: decks.length,
            vocab: 0,
            render: 0,
            review: 0,
            exam: 0,
        };
        for (const deck of decks) {
            // `drill` has no filter entry; every other type maps to its own count.
            counts[deck.type] += 1;
        }
        return counts;
    }, [decks]);

    const selected = useMemo(
        () => decks.find((deck) => deck.id === selectedId) ?? null,
        [decks, selectedId],
    );

    /**
     * Persists a dragged order. When a view or type filter hides some decks, the
     * moved ids only fill their own slots in the full list, so hidden decks keep
     * their relative position instead of being re-indexed away.
     */
    const reorder = (orderedIds: string[]) => {
        const byId = new Map(decks.map((deck) => [deck.id, deck]));
        const moving = new Set(orderedIds);
        let cursor = 0;
        const nextIds = decks.map((deck) => (moving.has(deck.id) ? orderedIds[cursor++] : deck.id));
        nextIds.forEach((id, index) => {
            if (byId.get(id)?.index !== index) updateDeck(language, id, { index });
        });
    };

    const update = (patch: Partial<DeckData>) => {
        if (selected) updateDeck(language, selected.id, patch);
    };

    /** Clears the selection only when the removed deck was the one selected. */
    const remove = (id?: string) => {
        const target = id ?? selectedId;
        if (!target) return;
        removeDeck(language, target);
        if (target === selectedId) setSelection(language, null);
    };

    return {
        decks,
        selectedId,
        selected,
        visibleDecks,
        typeFilter,
        typeCounts,
        view,
        select: (id) => setSelection(language, id),
        setTypeFilter: (value) => setFilter(language, value),
        setView: (value) => setViewStore(language, value),
        reorder,
        update,
        remove,
    };
}
