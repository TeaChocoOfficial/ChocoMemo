// -Path: 'client/app/types/deckList.ts'
// The view state a deck-list page keeps in the URL.
//
// Every field here round-trips through the query string, so anything added to
// this file is automatically shareable, bookmarkable and back-navigable. That
// is the whole reason it is a single object rather than scattered `useState`
// calls: one shape in, one shape out, and the default values below define what
// "no query string" means.
import type { DeckSourceTab } from './deck';

export type { DeckSourceTab };

/** How the grid is ordered.
 *  - `default`: whatever the source produced — store order, or the order the
 *    bundled decks are declared in. Trusting the source keeps official decks in
 *    their authored sequence rather than re-sorting a curated list.
 *  - `name`: alphabetical by the viewer's language.
 *  - `recent`: newest `meta.updatedAt` first.
 *  - `popular`: most-downloaded first, for the sources that report it.
 *  - `size`: largest declared `meta.size` first. */
export type DeckSort = 'default' | 'name' | 'recent' | 'popular' | 'size';

/** How much room each card gets.
 *  - `comfortable`: the roomy default, best for browsing by cover.
 *  - `compact`: more columns and tighter gutters, best for scanning names. */
export type DeckDensity = 'comfortable' | 'compact';

/** A single view of a deck list: which source, narrowed by how. */
export interface DeckListQuery {
    /** Which source tab is showing. */
    tab: DeckSourceTab;
    /** Free-text match over name, description and tags. */
    search: string;
    sort: DeckSort;
    density: DeckDensity;
    /** When false, decks flagged `nsfw` are hidden even if they match. */
    nsfw: boolean;
    /** Every selected tag must be present — tags narrow, they never widen. */
    tags: string[];
}

/** The query that a bare URL means: the local tab, nothing narrowed. */
export const DEFAULT_DECK_LIST_QUERY: DeckListQuery = {
    tab: 'local',
    search: '',
    sort: 'default',
    density: 'comfortable',
    nsfw: false,
    tags: [],
};