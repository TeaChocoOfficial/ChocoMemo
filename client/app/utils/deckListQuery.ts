// -Path: 'client/app/utils/deckListQuery.ts'
// Reading and writing the deck-list view state, as a pure pair.
//
// Split from the hook that consumes it so the URL contract is testable on its
// own and so `DeckListPage` never hand-rolls `URLSearchParams`. Two rules hold
// throughout:
//
//  1. Every value read from the URL is validated against the same list the UI
//     renders from. A hand-edited `?tab=nonsense` must fall back to the
//     default, not reach a component that has no matching case — otherwise the
//     server render and the client render can disagree, which is a hydration
//     mismatch rather than a bug report.
//  2. Defaults are omitted when serializing. A URL only carries what the viewer
//     actually chose, so the common case stays `/japanese/vocab` and a shared
//     link never pins a preference that used to be the implicit one.
import { DEFAULT_DECK_LIST_QUERY } from '~/types/deckList';
import type { DeckDensity, DeckListQuery, DeckSort } from '~/types/deckList';
import type { DeckSource } from '~/types/deck';
import type { DeckData } from '~/types/deck';

/** Query-string keys, named once so parsing and writing cannot drift. */
export const DECK_LIST_PARAMS = {
    tab: 'tab',
    search: 'q',
    sort: 'sort',
    density: 'density',
    nsfw: 'nsfw',
    tags: 'tags',
} as const;

/** Tab order. What the viewer made, then what the app ships, then the two
 *  sources still waiting on a server — the same order the tally used to list. */
export const DECK_SOURCE_TABS: readonly DeckSource[] = [
    'local',
    'official',
    'cloud',
    'community',
];

export const DECK_SORTS: readonly DeckSort[] = ['default', 'name', 'recent', 'popular', 'size'];

export const DECK_DENSITIES: readonly DeckDensity[] = ['comfortable', 'compact'];

/** Reads a value only when it is one of the options the UI can actually show. */
function pick<T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T {
    return raw != null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;
}

/** `?tags=a,b` — empty and repeated entries are dropped rather than shown as a
 *  chip with no name, and duplicates collapse so `?tags=jl&tags=jl` is `?tags=jl`. */
function parseTags(raw: string | null): string[] {
    if (!raw) return [];
    const seen = new Set<string>();
    for (const tag of raw.split(',')) {
        const trimmed = tag.trim();
        if (trimmed) seen.add(trimmed);
    }
    return [...seen];
}

/**
 * Turns a URL's search params into a query, substituting the default for every
 * value that is missing or unrecognised.
 */
export function parseDeckListQuery(params: URLSearchParams): DeckListQuery {
    // `nsfw` is opt-in, so anything other than an explicit `1`/`true` means
    // "leave it hidden". Reading presence alone would expose flagged decks to
    // anyone who appended `?nsfw`.
    const nsfwRaw = params.get(DECK_LIST_PARAMS.nsfw);

    return {
        tab: pick(params.get(DECK_LIST_PARAMS.tab), DECK_SOURCE_TABS, DEFAULT_DECK_LIST_QUERY.tab),
        search: params.get(DECK_LIST_PARAMS.search)?.trim() ?? DEFAULT_DECK_LIST_QUERY.search,
        sort: pick(params.get(DECK_LIST_PARAMS.sort), DECK_SORTS, DEFAULT_DECK_LIST_QUERY.sort),
        density: pick(
            params.get(DECK_LIST_PARAMS.density),
            DECK_DENSITIES,
            DEFAULT_DECK_LIST_QUERY.density,
        ),
        nsfw: nsfwRaw === '1' || nsfwRaw === 'true',
        tags: parseTags(params.get(DECK_LIST_PARAMS.tags)),
    };
}

/** Serializes a query back to search params, leaving out every default. */
export function deckListQueryToParams(query: DeckListQuery): URLSearchParams {
    const params = new URLSearchParams();
    const set = (key: string, value: string) => {
        if (value) params.set(key, value);
    };

    set(DECK_LIST_PARAMS.tab, query.tab === DEFAULT_DECK_LIST_QUERY.tab ? '' : query.tab);
    set(DECK_LIST_PARAMS.search, query.search.trim());
    set(DECK_LIST_PARAMS.sort, query.sort === DEFAULT_DECK_LIST_QUERY.sort ? '' : query.sort);
    set(
        DECK_LIST_PARAMS.density,
        query.density === DEFAULT_DECK_LIST_QUERY.density ? '' : query.density,
    );
    set(DECK_LIST_PARAMS.nsfw, query.nsfw ? '1' : '');
    set(DECK_LIST_PARAMS.tags, query.tags.join(','));

    return params;
}

/** True when nothing narrows the list — used to decide whether a "clear
 *  everything" affordance is worth showing at all. */
export function isDeckListQueryDefault(query: DeckListQuery): boolean {
    return deckListQueryToParams(query).toString() === '';
}

/** Adds or removes one tag, keeping the set free of duplicates. */
export function toggleQueryTag(tags: string[], tag: string): string[] {
    return tags.includes(tag) ? tags.filter((each) => each !== tag) : [...tags, tag];
}

/** Every tag present in a list, most-used first so the chips lead with the
 *  ones that actually narrow something, then alphabetical to stay stable. */
export function collectDeckTags(decks: DeckData[], limit = 12): string[] {
    const counts = new Map<string, number>();
    for (const deck of decks) {
        for (const tag of deck.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }

    return [...counts.entries()]
        .sort(([tagA, countA], [tagB, countB]) =>
            countA === countB ? tagA.localeCompare(tagB) : countB - countA,
        )
        .slice(0, limit)
        .map(([tag]) => tag);
}

/** Orders a list for display. `default` hands the source order straight back —
 *  re-sorting would discard the curated sequence the bundled decks ship with. */
export function sortDecks(
    decks: DeckData[],
    sort: DeckSort,
    resolveName: (deck: DeckData) => string,
): DeckData[] {
    // Sorting a copy: `decks` is the store's array, and mutating its order in
    // place would leak into every other reader of the same store.
    const sorted = [...decks];

    switch (sort) {
        case 'name':
            return sorted.sort((a, b) => resolveName(a).localeCompare(resolveName(b)));
        case 'recent':
            return sorted.sort(
                (a, b) => Date.parse(b.meta.updatedAt) - Date.parse(a.meta.updatedAt),
            );
        case 'popular':
            // Most downloads first. Sources that do not report a count rank
            // last rather than tying with a real zero, so "popular" stays
            // meaningful on the local tab where every deck is unmeasured.
            return sorted.sort((a, b) => (b.meta.downloadCount ?? -1) - (a.meta.downloadCount ?? -1));
        case 'size':
            return sorted.sort((a, b) => (b.meta.size ?? -1) - (a.meta.size ?? -1));
        default:
            return sorted;
    }
}