import type { Role } from './auth';
import type { LangText } from './type';
import type { ExamQuestion } from './exam';
import type { Languages } from '~/data/language';

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

export type DeckType = 'vocab' | 'render' | 'drill' | 'review' | 'exam';

/** A deck data: a named, reviewable collection of words.
 *  Words are referenced by id; resolution depends on the source. */
export interface DeckData {
    id: string;
    name: LangText;
    description?: LangText;
    source: DeckSource;
    image?: string;
    type: DeckType;
    tags: string[];
    nsfw: boolean;
    /** Ids of the deck's content, resolved according to `type`: word ids for
     *  'vocab'/'review', passage ids for 'render', question ids for 'exam'.
     *  The content itself is never inlined on the deck, so a list only carries
     *  references and a session resolves what it needs on demand. */
    contentIds: string[];
    meta?: DeckMeta;
}

export type DeckLists = Partial<Record<Languages, DeckData[]>>;
