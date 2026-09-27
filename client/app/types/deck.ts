import type { Role } from './auth';
import type { LangText } from './type';

export type Version = `${number}.${number}.${number}`;

/** Origin of a vocabulary deck. Decks can come from the built-in set,
 *  the user's own local words, the user's cloud data (server sync —
 *  planned), or decks downloaded from other users. */
export type DeckSource = 'default' | 'cloud' | 'local';

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
    visibility: 'public' | 'unlisted' | 'private';
}

/** A deck data: a named, reviewable collection of words.
 *  Words are referenced by id; resolution depends on the source. */
export interface DeckData {
    id: string;
    name: LangText;
    description?: LangText;
    source: DeckSource;
    image?: string;
    tags: string[];
    nsfw: boolean;
    /** Ids of the words in this deck. For 'default' decks these are
     *  ids for local/cloud/decks they are the
     *  stored word ids. */
    wordIds: string[];
    /** Deployment info for cloud decks (author, timestamp,
     *   etc.) — reserved for the future server-backed sync. */
    meta?: DeckMeta;
}
