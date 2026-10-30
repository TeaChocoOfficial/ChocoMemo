// -Path: 'client/app/components/edit/useDeckEditor.ts'
import type { DeckMeta, DeckFilter, DeckSource, DeckView, DeckData } from '~/types/deck';
import { useMemo } from 'react';
import { useTargetLang } from '../base/useTargetLang';
import { useFavouritesStore } from '~/stores/deck/favourites.store';
import { useDeckListLocalStore } from '~/stores/deck/deckListLocal.store';
import type { DeckDensity, DeckNsfwFilter, DeckSort } from '~/types/deckList';
import type { DeckFormPatch } from '~/utils/edit/deckForm';
import { useDeckEditorStore, type DeckEditorData } from '~/stores/deck/deckEditor.store';

/** What the editor form collects when creating a deck; the store fills the rest
 *  (id, meta defaults and target language). */
export type NewDeckInput = DeckFormPatch & {
    /** Meta rows the author set, spread over the store's defaults. */
    meta?: Partial<DeckMeta>;
};

/** The editor surface `useDeckEditor` exposes to any language track. */
export interface DeckEditor {
    data: DeckEditorData;
    creating: boolean;
    decks: DeckData[];
    create: (deck: NewDeckInput) => string;
    selected: DeckData | null;
    startCreate: () => void;
    visibleDecks: DeckData[];
    typeCounts: Record<DeckFilter, number>;
    clearTags: () => void;
    remove: (id?: string) => void;
    toggleTag: (tag: string) => void;
    setSort: (sort: DeckSort) => void;
    setView: (value: DeckView) => void;
    setSearch: (value: string) => void;
    select: (id: string | null) => void;
    setFilter: (value: DeckFilter) => void;
    reorder: (orderedIds: string[]) => void;
    setNsfw: (nsfw: DeckNsfwFilter) => void;
    setSource: (source: DeckSource) => void;
    update: (patch: Partial<DeckData>) => void;
    setDensity: (density: DeckDensity) => void;
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
    const {
        setSort,
        setNsfw,
        setView,
        setFilter,
        setSearch,
        setSource,
        clearTags,
        toggleTag,
        setDensity,
        setCreating,
        setSelectedId,
    } = useDeckEditorStore();
    const language = useTargetLang();
    const { ids } = useFavouritesStore();
    const { addDeck, removeDeck, updateDeck } = useDeckListLocalStore();
    const data = useDeckEditorStore((state) => state.datas[language]);
    const storedDecks = useDeckListLocalStore((state) => state.deckLists[language]);

    /** Store order is insertion order, so `index` is what the editor shows. */
    const decks = useMemo(
        () => [...(storedDecks ?? [])].sort((a, b) => a.index - b.index),
        [storedDecks],
    );

    /** The view narrows the collection; the type filter then narrows that. */
    const viewedDecks = useMemo(() => {
        if (data.view === 'favourites') return decks.filter((deck) => ids[deck.id]);
        if (data.view === 'recent')
            return [...decks].sort((a, b) => b.meta.updatedAt.localeCompare(a.meta.updatedAt));
        return decks;
    }, [decks, data, ids]);

    const visibleDecks = useMemo(
        () =>
            data.filter === 'all'
                ? viewedDecks
                : viewedDecks.filter((deck) => deck.type === data.filter),
        [viewedDecks, data.filter],
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
        () => decks.find((deck) => deck.id === data.selectedId) ?? null,
        [decks, data.selectedId],
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

    /** Files the drafted deck (order and contents come from the form) and
     *  selects it, which leaves the form in edit mode on the deck just made. */
    const create = (deck: NewDeckInput) => {
        const { meta, ...fields } = deck;
        const id = addDeck(language, fields, meta);
        setCreating(language, false);
        setSelectedId(language, id);
        return id;
    };

    /** Opens an empty form; the selection is cleared so the panel never edits a
     *  deck the user did not pick. */
    const startCreate = () => {
        setCreating(language, true);
        setSelectedId(language, null);
    };

    /** Clears the selection only when the removed deck was the one selected. */
    const remove = (id?: string) => {
        const target = id ?? data.selectedId;
        if (!target) return;
        removeDeck(language, target);
        if (target === data.selectedId) setSelectedId(language, null);
    };

    return {
        data,
        create,
        decks,
        selected,
        startCreate,
        creating: data.creating === true,
        typeCounts,
        visibleDecks,
        update,
        remove,
        reorder,
        clearTags: () => clearTags(language),
        setSort: (sort) => setSort(language, sort),
        setNsfw: (nsfw) => setNsfw(language, nsfw),
        select: (id) => {
            setCreating(language, false);
            setSelectedId(language, id);
        },
        setView: (value) => setView(language, value),
        toggleTag: (tag) => toggleTag(language, tag),
        setSource: (value) => setSource(language, value),
        setFilter: (value) => setFilter(language, value),
        setSearch: (search) => setSearch(language, search),
        setDensity: (density) => setDensity(language, density),
    };
}
