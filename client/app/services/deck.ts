// -Path: 'client/app/services/deck.ts'
// The community/cloud deck API.
//
// Every response is validated with zod before it reaches a store, so a
// mismatched deploy shows up as a thrown parse error rather than as `undefined`
// halfway down a component tree. The parsed shape is the client's own
// `DeckData`, so a validated deck drops straight into the deck-list stores.
import { z } from 'zod';
import serverRest, { schemaParse } from './axios';
import { Role } from '~/types/auth';
import type { DeckData, DeckSource, DeckType, DeckVisibility, Version } from '~/types/deck';
import type { Languages } from '~/data/language';

/** A name/description as the API sends it: always a map of language to text,
 *  because the server normalises a bare string on the way in. `DeckData` allows
 *  both shapes, so this is a strict subset of it. */
const langTextSchema = z.record(z.string(), z.string());

const authorSchema = z.object({
    userId: z.string(),
    name: z.string(),
    nameTag: z.string(),
    avatar: z.string().optional(),
    role: z.string(),
});

const metaSchema = z.object({
    author: authorSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
    downloadUrl: z.string().optional(),
    downloadCount: z.number(),
    version: z.string(),
    // Both are absent rather than zero/false when nobody has hearted a deck.
    heart: z.number().optional(),
    isHeart: z.boolean().optional(),
    visibility: z.string(),
});

/** The API's `DeckData`. Parsed, then handed on as `DeckData` — the two models
 *  agree field for field, and the cast is checked here rather than trusted. */
export const deckSchema = z.object({
    id: z.string(),
    name: langTextSchema,
    description: langTextSchema.optional(),
    type: z.string(),
    language: z.string(),
    tags: z.array(z.string()),
    nsfw: z.boolean(),
    image: z.string().optional(),
    contentIds: z.array(z.string()),
    meta: metaSchema,
});

const deckPageSchema = z.object({
    items: z.array(deckSchema),
    nextCursor: z.string().nullable(),
});

/** One page of decks plus the cursor for the next, or `null` on the last page. */
export interface DeckPage {
    decks: DeckData[];
    nextCursor: string | null;
}

export interface FetchDecksQuery {
    language: Languages;
    /** Omitted when a caller wants every type for the language: the deck-list
     *  stores are keyed by language and hold all types, filtering as they
     *  render. Narrowing server-side is for a page that only ever shows one. */
    type?: DeckType;
    /** `mine` asks for the caller's own decks in any visibility. */
    cursor?: string | 'mine';
    limit?: number;
    sort?: 'recent' | 'popular';
    tag?: string;
}

const buildQuery = (query: FetchDecksQuery): string => {
    const params = new URLSearchParams({ language: query.language });
    if (query.type) params.set('type', query.type);
    if (query.cursor) params.set('cursor', query.cursor);
    if (query.limit) params.set('limit', String(query.limit));
    if (query.sort) params.set('sort', query.sort);
    if (query.tag) params.set('tag', query.tag);
    return params.toString();
};

/** Widens a validated API deck to the client's model. The two models agree
 *  field for field, so this only re-labels the fields the API sends as plain
 *  strings, and tags the deck with which list it came from — the API has no
 *  such column, since one deck can legitimately appear in more than one list.
 *
 *  `language` is dropped on purpose: the client keys its lists by language
 *  rather than carrying it on each deck. */
const toDeckData = (deck: z.infer<typeof deckSchema>, source: DeckSource): DeckData => ({
    id: deck.id,
    name: deck.name,
    description: deck.description,
    source,
    type: deck.type as DeckType,
    image: deck.image,
    tags: deck.tags,
    nsfw: deck.nsfw,
    contentIds: deck.contentIds,
    meta: {
        author: { ...deck.meta.author, role: deck.meta.author.role as Role },
        createdAt: deck.meta.createdAt,
        updatedAt: deck.meta.updatedAt,
        downloadUrl: deck.meta.downloadUrl,
        downloadCount: deck.meta.downloadCount,
        version: deck.meta.version as Version,
        heart: deck.meta.heart,
        isHeart: deck.meta.isHeart,
        visibility: deck.meta.visibility as DeckVisibility,
    },
});

const deckAPI = {
    /** One page. Throws when the session is absent and the caller asked for
     *  `mine`, which the store turns into an error state. */
    page: async (
        query: FetchDecksQuery,
        source: DeckSource = 'community',
    ): Promise<DeckPage> => {
        const res = await schemaParse(
            deckPageSchema,
            serverRest.get(`/decks?${buildQuery(query)}`),
        );
        return {
            decks: res.data.items.map((deck: z.infer<typeof deckSchema>) =>
                toDeckData(deck, source),
            ),
            nextCursor: res.data.nextCursor,
        };
    },

    /** Every page, walked to the end. Used where a complete list is needed
     *  rather than a scrollable one — a search across the whole catalogue, or
     *  seeding a cache. */
    all: async (query: FetchDecksQuery): Promise<DeckData[]> => {
        const decks: DeckData[] = [];
        let cursor: string | 'mine' | undefined = query.cursor;
        // A cursor walks a feed that can grow between pages, so this could in
        // principle never end. Bounded, because an unbounded loop against a
        // live feed is worse than a short list.
        for (let page = 0; page < 50; page++) {
            const result = await deckAPI.page({ ...query, cursor });
            decks.push(...result.decks);
            if (!result.nextCursor) break;
            cursor = result.nextCursor;
        }
        return decks;
    },

    /** One deck. */
    one: async (id: string, source: DeckSource = 'community'): Promise<DeckData> => {
        const res = await schemaParse(deckSchema, serverRest.get(`/decks/${id}`));
        return toDeckData(res.data, source);
    },
};

export default deckAPI;
