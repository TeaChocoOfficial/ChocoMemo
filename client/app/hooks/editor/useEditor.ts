// -Path: 'client/app/components/edit/useDeckEditor.ts'
import { useMemo } from 'react';
import { useTargetLang } from '../base/useTargetLang';
import { useDeckEditorStore } from '~/stores/deck/deckEditor.store';
import { useFavouritesStore } from '~/stores/deck/favourites.store';
import { useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';
import type { DeckData, DeckFilter, DeckSource, DeckView } from '~/types/deck';

/** The editor surface `useDeckEditor` exposes to any language track. */
export interface DeckEditor {
    view: DeckView;
    decks: DeckData[];
    sources: DeckSource;
    selected: DeckData | null;
    selectedId: string | null;
    typeFilters: DeckFilter;
    visibleDecks: DeckData[];
    typeCounts: Record<DeckFilter, number>;
    remove: (id?: string) => void;
    select: (id: string | null) => void;
    setView: (value: DeckView) => void;
    reorder: (orderedIds: string[]) => void;
    setSource: (source: DeckSource) => void;
    update: (patch: Partial<DeckData>) => void;
    setTypeFilters: (value: DeckFilter) => void;
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
export function useEditor(): DeckEditor {
    const language = useTargetLang();
    const { ids } = useFavouritesStore();
    const { removeDeck, updateDeck } = useDeckListLocalStore();
    const view = useDeckEditorStore((state) => state.views[language] ?? 'all');
    const { setView, setSource, setFilter, setSelection } = useDeckEditorStore();
    const storedDecks = useDeckListLocalStore((state) => state.deckLists[language]);
    const sources = useDeckEditorStore((state) => state.sources[language] ?? 'local');
    const typeFilters = useDeckEditorStore((state) => state.filters[language] ?? 'all');
    const selectedId = useDeckEditorStore((state) => state.selections[language] ?? null);

    /** Store order is insertion order, so `index` is what the editor shows. */
    const decks = useMemo(
        () => [...(storedDecks ?? [])].sort((a, b) => a.index - b.index),
        [storedDecks],
    );

    /** The view narrows the collection; the type filter then narrows that. */
    const viewedDecks = useMemo(() => {
        if (view === 'favourites') return decks.filter((deck) => ids[deck.id]);
        if (view === 'recent') {
            return [...decks].sort((a, b) => b.meta.updatedAt.localeCompare(a.meta.updatedAt));
        }
        return decks;
    }, [decks, view, ids]);

    const visibleDecks = useMemo(
        () =>
            typeFilters === 'all'
                ? viewedDecks
                : viewedDecks.filter((deck) => deck.type === typeFilters),
        [viewedDecks, typeFilters],
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
        view,
        decks,
        sources,
        selected,
        typeCounts,
        selectedId,
        typeFilters,
        visibleDecks,
        update,
        remove,
        reorder,
        select: (id) => setSelection(language, id),
        setView: (value) => setView(language, value),
        setSource: (value) => setSource(language, value),
        setTypeFilters: (value) => setFilter(language, value),
    };
}
