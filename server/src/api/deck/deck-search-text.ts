// -Path: 'src/api/deck/deck-search-text.ts'
// The one field search reads.
//
// Built at write time rather than queried live, because the deck's title is a
// map of languages and searching it per request would mean flattening a
// multi-language field inside a query, with no index either way. Normalising
// here means the query is a plain escaped substring match.

/** Every value in a language map, joined. */
const flatten = (text?: Record<string, string>): string =>
    text ? Object.values(text).join(' ') : '';

/**
 * Lowercased, NFKC-normalised `name` + `description` + `tags`, across every
 * language in the deck.
 *
 * NFKC matters for Japanese: it folds full-width Latin and half-width kana onto
 * their usual forms, so a deck typed with half-width kana is still found by a
 * search for the full-width spelling and vice versa.
 */
export function buildSearchText(deck: {
    name: Record<string, string>;
    description?: Record<string, string>;
    tags?: string[];
}): string {
    return [flatten(deck.name), flatten(deck.description), (deck.tags ?? []).join(' ')]
        .filter(Boolean)
        .join(' ')
        .normalize('NFKC')
        .toLowerCase()
        .trim();
}

/** Escapes a user-supplied query so it is matched literally.
 *
 * Without this a search for `c++` or `(n)` is a malformed regular expression
 * and the request fails; worse, a query like `.*` would match every deck in the
 * database. A backslash is escaped first, or it would double-escape the
 * characters that follow it. */
export function escapeForRegex(query: string): string {
    return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
