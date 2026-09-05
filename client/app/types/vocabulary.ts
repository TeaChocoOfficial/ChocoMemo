// -Path: 'client/app/types/vocabulary.ts'
import type { Lang } from '../i18n/locales';

export type LangText = string | Partial<Record<Lang, string>>;

/** One character (or kana run) of the target word inside the example
 *  sentence. A kanji carries its own reading (`rt`); okurigana written
 *  as kana has no `rt` and renders bare. This keeps the sentence text
 *  surface form independent from the dictionary form (`word.word`) and
 *  lets each kanji get its own furigana instead of spreading a single
 *  reading across the whole word.
 *  @variation ch characater
 *  @variation rt
 *  @variation mn meaning
 *  @variation dt details
 */
export interface VocabSegment {
    ch: string;
    rt?: string;
    mn?: LangText;
    dt?: LangText;
}

/** The example sentence is split into `before` / `segments` / `after` so
 *  the target's surface form and its per-character readings are stored
 *  explicitly instead of pasting `word.word` (dictionary form) in the
 *  middle — pasting breaks once the word is conjugated (e.g. 飲む →
 *  飲みましょう). Every part is segmented so every kanji in the sentence
 *  gets its own furigana, not just the target. */
export interface VocabExample {
    before: VocabSegment[];
    segments: VocabSegment[];
    after: VocabSegment[];
    meaning: LangText;
}

export interface VocabWord {
    id: string;
    word: string;
    reading: string;
    meaning: LangText;
    example: VocabExample;
    note?: LangText;
    imageUrl?: string;
    audioWordUrl?: string;
    audioSentenceUrl?: string;
}

/** Origin of a vocabulary deck. Decks can come from the built-in set,
 *  the user's own local words, the user's cloud data (server sync —
 *  planned), or decks downloaded from other users. */
export type DeckSource = 'default' | 'custom' | 'cloud' | 'downloaded';

/** A vocabulary deck (dex): a named, reviewable collection of words.
 *  Words are referenced by id; resolution depends on the source. */
export interface VocabDeck {
    id: string;
    name: LangText;
    description?: LangText;
    source: DeckSource;
    /** Ids of the words in this deck. For 'default' decks these are
     *  ids in DEFAULT_VOCABULARY; for local/cloud/decks they are the
     *  stored word ids. */
    wordIds: string[];
    /** Deployment info for cloud/downloaded decks (author, timestamp,
     *   etc.) — reserved for the future server-backed sync. */
    meta?: DeckMeta;
}

export interface DeckMeta {
    author?: string;
    createdAt?: string;
    remoteId?: string;
    downloadUrl?: string;
}
