import type { Role } from './auth';
import type { LangText } from './type';
import type { Languages } from '~/data/language';

export type Version = `${number}.${number}.${number}`;

/** Where a deck came from, which decides who may edit it.
 *  - `official`: ships inside the app bundle, read-only for everyone.
 *  - `local`: authored on this device by the viewer.
 *  - `cloud`: the viewer's own decks, server-synced (planned).
 *  - `community`: published by other users, fetched rather than owned. */
export type DeckSource = 'official' | 'local' | 'cloud' | 'community';

/** Who may see a deck. `unlisted` is reachable by link but absent from
 *  listings; `private` is the viewer's alone. */
export type DeckVisibility = 'public' | 'unlisted' | 'private';
export type DeckType = 'vocab' | 'render' | 'drill' | 'review' | 'exam';
export type DeckListStatus = 'idle' | 'loading' | 'ready' | 'error';

/** How a downloaded copy relates to the deck it came from.
 *  - `tracking`: read-only mirror. When the author updates the origin
 *    deck, this copy is refreshed to match on next sync.
 *  - `forked`: detached, editable copy. No longer receives updates
 *    from the origin, even if the author changes it later. */
export type DeckSyncMode = 'tracking' | 'forked';

export interface DeckAuthor {
    userId: string;
    name: string;
    nameTag: string;
    avatar?: string;
    role: Role;
}

export interface DeckMeta {
    author: DeckAuthor;
    createdAt: string;
    updatedAt: string;
    downloadUrl?: string;
    downloadCount?: number;
    version: Version;
    heart?: number;
    isHeart?: boolean;
    visibility: DeckVisibility;
    /** Set by the author on a public/unlisted deck. If false (default),
     *  viewers can only download a `tracking` copy — never fork it into
     *  an independently editable deck. Meaningless on `private` decks. */
    allowFork?: boolean;
    /** Total size, in bytes, of this deck's resolved content — the words,
     *  passages, images and audio that `contentIds` points to — not the
     *  size of this `DeckData`/`DeckMeta` object itself, which is tiny
     *  since it only carries id references. Lets a deck list show a size
     *  (e.g. "~2.4 MB") before the viewer downloads a community/cloud
     *  deck. Recompute and bump this whenever the resolved content
     *  changes, otherwise a stale value will under- or over-report size. */
    size?: number;
}

/** Present only on a downloaded copy of a `community`/`cloud` deck.
 *  Absent on `official` and freshly-authored `local` decks, since those
 *  have no origin to track or fork from. */
export interface DeckOrigin {
    /** Id of the deck this copy was downloaded from. */
    deckId: string;
    authorId: string;
    mode: DeckSyncMode;
    /** Origin's `meta.version` this copy currently reflects. Compare
     *  against the origin's live version to know an update is available. */
    syncedVersion: Version;
    syncedAt: string;
}

/** A deck data: a named, reviewable collection of words.
 *  Words are referenced by id; resolution depends on the source. */
export interface DeckData extends CreateDeckData {
    id: string;
}

export interface CreateDeckData {
    id?: string;
    /** The deck's title. Required: a deck is named on every card, in every
     *  list, and in the details page. */
    name: LangText;
    description?: LangText;
    source: DeckSource;
    image?: string;
    type: DeckType;
    tags: string[];
    nsfw: boolean;
    index: number;
    /** Ids of the deck's content, resolved according to `type`: word ids for
     *  'vocab'/'review', passage ids for 'render', question ids for 'exam'.
     *  The content itself is never inlined on the deck, so a list only carries
     *  references and a session resolves what it needs on demand. */
    contentIds: string[];
    meta: DeckMeta;
    /** Only set on a downloaded copy (`source: 'local'` or `'cloud'`
     *  that started life as someone else's `community` deck). */
    origin?: DeckOrigin;
}

export type DeckLists = Partial<Record<Languages, DeckData[]>>;
