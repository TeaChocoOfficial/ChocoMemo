// -Path: 'client/app/hooks/deck/useDeckListQuery.ts'
// The deck list's view state. The URL is the shareable source — a link shows the
// same tab, search and sort — and the persisted options fill a bare URL, so the
// viewer's preferences survive a reload.
//
// Two write modes, because the two kinds of change want opposite behaviour:
//
//  - `push` for deliberate, discrete choices — a tab, a sort, a density, a
//    tag. Each is a navigation the viewer might want to undo with Back.
//  - `replace` for the search box. Pushing per keystroke would bury the page
//    the viewer came from under a hundred identical history entries, so Back
//    would step through their own typing instead of leaving the search.
import {
    toggleQueryTag,
    DECK_LIST_PARAMS,
    parseDeckListQuery,
    deckListQueryToParams,
    isDeckListQueryDefault,
} from '~/utils/deck/deckListQuery';
import {
    useDeckListStore,
    type DeckListOptions,
    DEFAULT_DECK_LIST_OPTIONS,
} from '~/stores/config/deckList.store';
import type { DeckSource } from '~/types/deck';
import { useSearchParams } from 'react-router';
import { DEFAULT_DECK_LIST_QUERY } from '~/types/deckList';
import { useDeckListOptions } from '~/hooks/deck/useDeckListOptions';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { DeckDensity, DeckListQuery, DeckNsfwFilter, DeckSort } from '~/types/deckList';

/** How a change should land in history: a view worth going Back to, or a
 *  refinement happening faster than anyone would click through. */
type CommitMode = 'push' | 'replace';

/** The store-backed options a setter is saving in the same call. */
type SavedOptions = Partial<Pick<DeckListOptions, 'sort' | 'density' | 'nsfw'>>;

/** A patch, or a function of the query currently in the URL. The function form
 *  exists for `toggleTag`, which cannot express "flip this one" as a patch. */
type QueryUpdate = Partial<DeckListQuery> | ((current: DeckListQuery) => Partial<DeckListQuery>);

export interface DeckListQueryControls {
    /** The view state, defaults filled in. */
    query: DeckListQuery;
    /** A discrete choice the viewer made — worth a history entry. */
    push: (update: QueryUpdate) => void;
    /** A refinement happening too fast to be worth a history entry. */
    replace: (update: QueryUpdate) => void;
    setTab: (tab: DeckSource) => void;
    setSearch: (search: string) => void;
    setSort: (sort: DeckSort) => void;
    setDensity: (density: DeckDensity) => void;
    setNsfw: (nsfw: DeckNsfwFilter) => void;
    toggleTag: (tag: string) => void;
    /** Clears the deck-list filters and options, keeping the `?target=` filter. */
    reset: () => void;
    /** True while nothing is narrowed, so callers can hide "clear". */
    isDefault: boolean;
}

/**
 * Reads the deck list's view state out of the query string and hands back
 * setters that write it back.
 *
 * Safe during SSR: the persisted options are read only after mount, so the
 * server render and the client's first paint agree on the defaults rather than
 * flashing a stored preference.
 */
export function useDeckListQuery(): DeckListQueryControls {
    const { save } = useDeckListStore();
    const options = useDeckListOptions();
    const [searchParams, setSearchParams] = useSearchParams();

    /** The params most recently written. Two commits in one tick must build on each
     *  other, but `searchParams` only updates after the next render. */
    const latestParams = useRef(searchParams);

    useEffect(() => {
        // Resync whenever the router reports new params (Back, another control).
        latestParams.current = searchParams;
    }, [searchParams]);

    // A bare URL falls back to the viewer's saved options; an explicit param in
    // the link still wins.
    const defaults = useMemo<DeckListQuery>(
        () => ({
            ...DEFAULT_DECK_LIST_QUERY,
            sort: options.sort,
            density: options.density,
            nsfw: options.nsfw,
        }),
        [options.sort, options.density, options.nsfw],
    );

    const query = useMemo(
        () => parseDeckListQuery(searchParams, defaults),
        [searchParams, defaults],
    );

    const commit = useCallback(
        (update: QueryUpdate, mode: CommitMode, saved?: SavedOptions) => {
            const base = latestParams.current;
            const current = parseDeckListQuery(base, defaults);
            const patch = typeof update === 'function' ? update(current) : update;

            // The store is saved in the same call, so write the URL against the
            // defaults it is about to have. Otherwise the new value is also left in
            // the URL as a redundant explicit param, which later outranks the store.
            const next = deckListQueryToParams({ ...current, ...patch }, { ...defaults, ...saved });

            const merged = new URLSearchParams(base);
            for (const key of Object.values(DECK_LIST_PARAMS)) merged.delete(key);
            next.forEach((value, key) => merged.set(key, value));

            latestParams.current = merged;
            setSearchParams(merged, { replace: mode === 'replace', preventScrollReset: true });
        },
        [setSearchParams, defaults],
    );

    const push = useCallback((update: QueryUpdate) => commit(update, 'push'), [commit]);
    const replace = useCallback((update: QueryUpdate) => commit(update, 'replace'), [commit]);

    const setTab = useCallback((tab: DeckSource) => push({ tab }), [push]);
    const setSearch = useCallback((search: string) => replace({ search }), [replace]);
    const toggleTag = useCallback(
        (tag: string) => push((current) => ({ tags: toggleQueryTag(current.tags, tag) })),
        [push],
    );

    // Display options are remembered, so they survive a reload even though the
    // URL is the visible source of truth.

    const setSort = useCallback(
        (sort: DeckSort) => {
            save({ sort });
            push({ sort });
        },
        [save, push],
    );
    const setDensity = useCallback(
        (density: DeckDensity) => {
            save({ density });
            push({ density });
        },
        [save, push],
    );
    const setNsfw = useCallback(
        (nsfw: DeckNsfwFilter) => {
            save({ nsfw });
            push({ nsfw });
        },
        [save, push],
    );

    const reset = useCallback(() => {
        save({
            sort: DEFAULT_DECK_LIST_OPTIONS.sort,
            density: DEFAULT_DECK_LIST_OPTIONS.density,
            nsfw: DEFAULT_DECK_LIST_OPTIONS.nsfw,
        });
        const next = new URLSearchParams(latestParams.current);
        for (const key of Object.values(DECK_LIST_PARAMS)) next.delete(key);
        next.set(DECK_LIST_PARAMS.tab, DEFAULT_DECK_LIST_QUERY.tab);
        latestParams.current = next;
        setSearchParams(next, { replace: true, preventScrollReset: true });
    }, [save, setSearchParams]);

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
        isDefault:
            isDeckListQueryDefault(query, defaults) && query.tab === DEFAULT_DECK_LIST_QUERY.tab,
    };
}
