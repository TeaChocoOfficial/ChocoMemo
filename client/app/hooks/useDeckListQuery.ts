// -Path: 'client/app/hooks/useDeckListQuery.ts'
// The deck list's view state, with the URL as the only storage.
//
// There is deliberately no `useState` mirror. A deck list is a *view onto* a
// collection, and a view is exactly the thing worth putting in the address bar:
// sharing the link shows the same tab, the same search and the same sort, and
// Back walks the viewer through the views they actually took. Duplicating the
// query into component state would buy nothing and would let the two drift on
// the first browser Back.
//
// Two write modes, because the two kinds of change want opposite behaviour:
//
//  - `push` for deliberate, discrete choices — a tab, a sort, a density, a
//    tag. Each is a navigation the viewer might want to undo with Back.
//  - `replace` for the search box. Pushing per keystroke would bury the page
//    the viewer came from under a hundred identical history entries, so Back
//    would step through their own typing instead of leaving the search.
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { DEFAULT_DECK_LIST_QUERY } from '~/types/deckList';
import type { DeckDensity, DeckListQuery, DeckSort, DeckSourceTab } from '~/types/deckList';
import {
    deckListQueryToParams,
    isDeckListQueryDefault,
    parseDeckListQuery,
    toggleQueryTag,
} from '~/utils/deckListQuery';

/** How a change should land in history: a view worth going Back to, or a
 *  refinement happening faster than anyone would click through. */
type CommitMode = 'push' | 'replace';

/** A patch, or a function of the query currently in the URL. The function form
 *  exists for `toggleTag`, which cannot express "flip this one" as a patch. */
type QueryUpdate = Partial<DeckListQuery> | ((current: DeckListQuery) => Partial<DeckListQuery>);

export interface DeckListQueryControls {
    /** The query currently in the URL, defaults filled in. */
    query: DeckListQuery;
    /** A discrete choice the viewer made — worth a history entry. */
    push: (update: QueryUpdate) => void;
    /** A refinement happening too fast to be worth a history entry. */
    replace: (update: QueryUpdate) => void;
    setTab: (tab: DeckSourceTab) => void;
    setSearch: (search: string) => void;
    setSort: (sort: DeckSort) => void;
    setDensity: (density: DeckDensity) => void;
    setNsfw: (nsfw: boolean) => void;
    toggleTag: (tag: string) => void;
    /** Back to a bare URL — the local tab, nothing narrowed. */
    reset: () => void;
    /** True while the query is the default, so callers can hide "clear". */
    isDefault: boolean;
}

/**
 * Reads the deck list's view state out of the query string and hands back
 * setters that write it back.
 *
 * Safe to call during SSR: `useSearchParams` reports the same params on the
 * server as on the client's first render, so a shared link hydrates onto the
 * view it names rather than flashing the default tab first.
 */
export function useDeckListQuery(): DeckListQueryControls {
    const [searchParams, setSearchParams] = useSearchParams();
    // `searchParams` is a fresh object per navigation, so parsing it is cheap
    // enough that memoizing only buys an identity for the returned `query`.
    const query = useMemo(() => parseDeckListQuery(searchParams), [searchParams]);

    const commit = useCallback(
        (update: QueryUpdate, mode: CommitMode) => {
            // Read the URL rather than the rendered `query`, so two controls
            // changing in the same tick — a tag click that also clears the
            // search, say — cannot undo each other.
            const current = parseDeckListQuery(searchParams);
            const patch = typeof update === 'function' ? update(current) : update;
            const next = deckListQueryToParams({ ...current, ...patch });

            setSearchParams(next, {
                replace: mode === 'replace',
                // Narrowing the list must not scroll the viewer back to the
                // top; they are already looking at the result.
                preventScrollReset: true,
            });
        },
        [searchParams, setSearchParams],
    );

    const push = useCallback((update: QueryUpdate) => commit(update, 'push'), [commit]);
    const replace = useCallback((update: QueryUpdate) => commit(update, 'replace'), [commit]);

    const setTab = useCallback((tab: DeckSourceTab) => push({ tab }), [push]);
    const setSort = useCallback((sort: DeckSort) => push({ sort }), [push]);
    const setDensity = useCallback((density: DeckDensity) => push({ density }), [push]);
    const setNsfw = useCallback((nsfw: boolean) => push({ nsfw }), [push]);
    const setSearch = useCallback((search: string) => replace({ search }), [replace]);

    const toggleTag = useCallback(
        (tag: string) => push((current) => ({ tags: toggleQueryTag(current.tags, tag) })),
        [push],
    );

    const reset = useCallback(() => {
        setSearchParams(new URLSearchParams(), { replace: true, preventScrollReset: true });
    }, [setSearchParams]);

    return {
        query,
        push,
        replace,
        setTab,
        setSearch,
        setSort,
        setDensity,
        setNsfw,
        toggleTag,
        reset,
        isDefault: isDeckListQueryDefault(query) && query.tab === DEFAULT_DECK_LIST_QUERY.tab,
    };
}