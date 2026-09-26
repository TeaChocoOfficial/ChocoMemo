import type { Lang } from '~/i18n/locales';

export type SetState<Value> = React.Dispatch<React.SetStateAction<Value>>;

/** for text can be many language */
export type MultiLang = Partial<Record<Lang, string>>;

export type LangText = string | MultiLang;

/** Origin of a vocabulary deck. Decks can come from the built-in set,
 *  the user's own local words, the user's cloud data (server sync —
 *  planned), or decks downloaded from other users. */
export type DeckSource = 'default' | 'cloud' | 'local';

export interface DeckMeta {
    author?: string;
    createdAt?: string;
    remoteId?: string;
    downloadUrl?: string;
}

/** A deck data: a named, reviewable collection of words.
 *  Words are referenced by id; resolution depends on the source. */
export interface DeckData {
    id: string;
    name: LangText;
    description?: LangText;
    source: DeckSource;
    /** Ids of the words in this deck. For 'default' decks these are
     *  ids for local/cloud/decks they are the
     *  stored word ids. */
    wordIds: string[];
    /** Deployment info for cloud decks (author, timestamp,
     *   etc.) — reserved for the future server-backed sync. */
    meta?: DeckMeta;
}
