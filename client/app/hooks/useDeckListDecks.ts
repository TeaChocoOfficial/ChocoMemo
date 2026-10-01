// -Path: 'client/app/hooks/useDeckListDecks.ts'
// Narrows a tab's decks down to what the viewer is actually looking at.
//
// The stages run in a fixed order — visibility, then tags, then text, then
// order — because each one is cheaper than the next and because the order
// decides what "no results" means. Tags narrow before the text search so a tag
// chip cannot be defeated by a term that happens to match a hidden deck.
//
// Kept out of `DeckList` so the page component stays about layout: this is
// pure data shaping with no JSX and no i18n.
import { useMemo } from 'react';
import type { Languages } from '~/data/language';
import { useLangText } from '~/hooks/useLangText';
import type { DeckListQuery } from '~/types/deckList';
import type { DeckData, DeckType } from '~/types/deck';
import { useDecksForTab } from '~/hooks/useDecksForTab';
import { useDeckSourceReady } from '~/hooks/useDeckSourceReady';
import { useIncrementalList } from '~/hooks/useIncrementalList';
import { collectDeckTags, sortDecks } from '~/utils/deckListQuery';

export interface DeckListResult {
    /** The page of cards to render right now. */
    visible: DeckData[];
    /** How many decks survive the whole query — the number beside the search. */
    matched: number;
    /** How many the tab holds before anything is narrowed. */
    total: number;
    /** Tags worth offering as chips, drawn from the tab's unfiltered decks so
     *  a selected chip stays visible after it has emptied the list. */
    availableTags: string[];
    /** True while the source still owes the UI its decks. */
    isLoading: boolean;
    /** True when the tab has decks but the query removed all of them. */
    isNarrowedEmpty: boolean;
    /** Attach to the element below the grid to load the next page. `undefined`
     *  when everything already fits, so the caller skips the sentinel rather
     *  than mounting an observer with nothing to append. */
    sentinelRef: ((node: HTMLElement | null) => void) | undefined;
    /** Everything the current query can undo. */
    isDefault: boolean;
}

/**
 * @param query The view state read from the URL. Every field participates,
 * which is what lets the whole toolbar live in the address bar.
 */
export function useDeckListDecks(
    language: Languages,
    type: DeckType,
    query: DeckListQuery,
): DeckListResult {
    const locale = useLangText();
    const decks = useDecksForTab(language, type, query.tab);
    const isLoading = useDeckSourceReady(language, query.tab);

    const name = useMemo(() => (deck: DeckData) => locale(deck.name), [locale]);

    // Every tag in the tab, taken before any narrowing — a chip that filtered
    // the list down to nothing would otherwise have nothing left to render,
    // leaving the viewer stuck with no way to switch it back off.
    const availableTags = useMemo(() => collectDeckTags(decks), [decks]);

    const matched = useMemo(() => {
        const needle = query.search.trim().toLowerCase();

        // Flags first: a hidden deck should not be able to pull itself back
        // into view by matching the search.
        let result = query.nsfw ? decks : decks.filter((deck) => !deck.nsfw);

        // Tags are a narrowing filter, never a widening one — a deck must
        // carry every selected tag to survive.
        if (query.tags.length > 0)
            result = result.filter((deck) => query.tags.every((tag) => deck.tags.includes(tag)));

        // Tags are the only place a deck says what it is about when it has no
        // description, so they belong in the search text too.
        if (needle) {
            result = result.filter((deck) =>
                [name(deck), deck.description ? locale(deck.description) : '', ...deck.tags]
                    .join(' ')
                    .toLowerCase()
                    .includes(needle),
            );
        }

        return sortDecks(result, query.sort, name);
    }, [decks, query.nsfw, query.tags, query.search, query.sort, name, locale]);

    // Any change of query starts the list over from the first page. The key is
    // built from the values rather than the object so it stays a primitive.
    const { visible, hasMore, sentinelRef } = useIncrementalList(
        matched,
        `${query.tab}:${query.sort}:${query.search}:${query.tags.join(',')}:${query.nsfw}`,
    );

    return {
        visible,
        matched: matched.length,
        total: decks.length,
        availableTags,
        isLoading,
        // Distinguishes "this tab is empty" from "your filter hid everything",
        // which are different problems and deserve different empty-state copy.
        isNarrowedEmpty: decks.length > 0 && matched.length === 0,
        sentinelRef: hasMore ? sentinelRef : undefined,
        isDefault:
            !query.search.trim() &&
            !query.nsfw &&
            query.sort === 'default' &&
            query.tags.length === 0,
    };
}
