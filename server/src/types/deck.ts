// -Path: "src/types/deck.ts"
//
// The deck vocabulary shared by the API, mirroring what the client stores. The
// deck model is deliberately content-agnostic: a deck holds an ordered list of
// content ids and the type says which collection those ids point at, so a
// vocabulary deck and an exam deck travel through the same code.

/** What a deck is for. `drill` is a session, not a list, so it never gets a
 *  community deck — it is here so the enum matches the client's `DeckType`. */
export enum DeckType {
    VOCAB = 'vocab',
    RENDER = 'render',
    DRILL = 'drill',
    REVIEW = 'review',
    EXAM = 'exam',
}

/** Which content collection a deck's `contentIds` resolve against. */
export const CONTENT_COLLECTION: Partial<Record<DeckType, string>> = {
    [DeckType.VOCAB]: 'deck_words',
    [DeckType.REVIEW]: 'deck_words',
    [DeckType.RENDER]: 'deck_passages',
    [DeckType.EXAM]: 'exam_questions',
};

/** The content kinds a deck can hold. Narrower than `DeckType` because
 *  vocabulary and review decks share one kind of content. */
export enum DeckContentKind {
    WORD = 'word',
    PASSAGE = 'passage',
    QUESTION = 'question',
}

export const CONTENT_KIND_BY_TYPE: Partial<Record<DeckType, DeckContentKind>> = {
    [DeckType.VOCAB]: DeckContentKind.WORD,
    [DeckType.REVIEW]: DeckContentKind.WORD,
    [DeckType.RENDER]: DeckContentKind.PASSAGE,
    [DeckType.EXAM]: DeckContentKind.QUESTION,
};

/** Who may see a deck. `unlisted` is reachable by link but absent from
 *  listings; `private` is the author's alone. */
export enum DeckVisibility {
    PUBLIC = 'public',
    UNLISTED = 'unlisted',
    PRIVATE = 'private',
}

/** Study languages, matching the client's `Languages` enum values. */
export enum Language {
    JAPANESE = 'japanese',
    ENGLISH = 'english',
    KOREAN = 'korean',
    THAI = 'thai',
    CHINESE = 'chinese',
}

/** A name, description or gloss in one language or many. Stored as a map of
 *  language code to text; the API normalises a bare string on the way in so
 *  the stored shape is always a map and search has one place to read. */
export type LangText = string | Record<string, string>;

/** Deck content revision, bumped whenever a deck's content changes. Matches the
 *  client's `` `${number}.${number}.${number}` `` type. */
export const DECK_VERSION = '0.0.1';
