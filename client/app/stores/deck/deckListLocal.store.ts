// Local-first store for deck lists the user owns or edits on-device.
// One store for every deck type (vocab / render / review / exam), keyed by
// language id, so the deck-list pages read from a single place. The
// server-synced counterpart is `deckList.store.ts`; the content these decks
// reference (words, passages) lives in its own store.
import { create } from 'zustand';
import { Languages } from '~/data/language';
import type { ExamSet } from '~/types/deck/exam';
import { importedDeckSchema } from '~/utils/deck';
import type { RenderPassage } from '~/types/deck/render';
import type { ExamQuestion } from '~/types/deck/exam';
import { importedExamSetSchema } from '~/utils/exam';
import { newDeckMeta } from '~/utils/deckMeta';
import type { DeckData, DeckLists } from '~/types/deck';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_PASSAGES } from '~/data/japanese/renderPassages';
import { defaultExamSets } from '~/data/temp/defaultExamSets';

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined;

const newId = (prefix: string) =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

interface DeckListLocalState {
    /** language id -> the user's decks in that language. */
    deckLists: DeckLists;
    /** Render passages the user authored. These are the content a
     *  `type: 'render'` deck points at via `contentIds`, kept here so the
     *  decks and their material live and die together. */
    passages: RenderPassage[];
    /** Exam questions the user built or imported. The content a
     *  `type: 'exam'` deck points at via `contentIds`; kept out of the deck so
     *  listing decks never carries a whole question set around. */
    questions: ExamQuestion[];
    addPassage: (passage: Omit<RenderPassage, 'id'>) => string;
    updatePassage: (id: string, passage: Omit<RenderPassage, 'id'>) => void;
    removePassage: (id: string) => void;
    /** Adds an exam set, mapping it onto the shared deck model. */
    addExamSet: (set: Omit<ExamSet, 'id'>) => string;
    /** Validates a raw exam JSON payload and files it as an exam deck.
     *  Returns an error message instead of throwing so the UI can show it. */
    importExamSet: (
        language: Languages,
        raw: unknown,
    ) => { success: true; id: string } | { success: false; error: string };
    addDeck: (language: Languages, deck: Omit<DeckData, 'id' | 'source' | 'meta'>) => string;
    updateDeck: (language: Languages, id: string, patch: Partial<DeckData>) => void;
    removeDeck: (language: Languages, id: string) => void;
    clearDecks: (language: Languages) => void;
    /** Validates a raw payload and files the deck under `language`. Returns an
     *  error message instead of throwing so the UI can show it inline. */
    importDeck: (
        language: Languages,
        raw: unknown,
    ) => { success: true; id: string } | { success: false; error: string };
}

/** Replace one language's list without touching the others. */
const withDecks = (state: DeckListLocalState, language: Languages, decks: DeckData[]) => ({
    deckLists: { ...state.deckLists, [language]: decks },
});

export const useDeckListLocalStore = create<DeckListLocalState>()(
    persist(
        (set, get) => ({
            deckLists: {},
            passages: [],
            questions: [],

            addDeck: (language, deck) => {
                const id = newId(deck.type);
                // Meta is stamped here rather than by the caller: the store is
                // the only place that knows a deck was just created, so no
                // caller can hand in a stale or borrowed byline.
                const stored: DeckData = { ...deck, id, source: 'local', meta: newDeckMeta() };
                set((state) =>
                    withDecks(state, language, [...(state.deckLists[language] ?? []), stored]),
                );
                return id;
            },

            updateDeck: (language, id, patch) =>
                set((state) =>
                    withDecks(
                        state,
                        language,
                        (state.deckLists[language] ?? []).map((deck) =>
                            deck.id === id ? { ...deck, ...patch, id } : deck,
                        ),
                    ),
                ),

            removeDeck: (language, id) =>
                set((state) =>
                    withDecks(
                        state,
                        language,
                        (state.deckLists[language] ?? []).filter((deck) => deck.id !== id),
                    ),
                ),

            clearDecks: (language) => set((state) => withDecks(state, language, [])),

            addPassage: (passage) => {
                const id = newId('p');
                set((state) => ({ passages: [...state.passages, { ...passage, id }] }));
                return id;
            },

            updatePassage: (id, passage) =>
                set((state) => ({
                    passages: state.passages.map((p) => (p.id === id ? { ...passage, id } : p)),
                })),

            // Also unlink the passage from any deck that referenced it, so
            // deleting a passage can't leave a deck pointing at nothing.
            removePassage: (id) =>
                set((state) => ({
                    passages: state.passages.filter((p) => p.id !== id),
                    deckLists: Object.fromEntries(
                        Object.entries(state.deckLists).map(([language, decks]) => [
                            language,
                            (decks ?? []).map((deck) => ({
                                ...deck,
                                contentIds: deck.contentIds.filter((c) => c !== id),
                            })),
                        ]),
                    ),
                })),

            addExamSet: (set_) => {
                const id = newId('exam');
                const deck: Omit<DeckData, 'id' | 'source' | 'meta'> = {
                    name: set_.title,
                    description: set_.description,
                    type: 'exam',
                    tags: [],
                    nsfw: false,
                    contentIds: set_.questions.map((q) => q.id),
                };
                get().addDeck(Languages.ja, deck);
                return id;
            },

            importExamSet: (language, raw) => {
                const result = importedExamSetSchema.safeParse(raw);
                if (!result.success) {
                    return { success: false, error: 'This file is not a valid exam set.' };
                }
                const id = get().addDeck(language, {
                    name: result.data.title,
                    description: result.data.description,
                    type: 'exam',
                    tags: [],
                    nsfw: false,
                    contentIds: result.data.questions.map((q) => q.id),
                });
                set((state) => ({ questions: [...state.questions, ...result.data.questions] }));
                return { success: true, id };
            },

            importDeck: (language, raw) => {
                const result = importedDeckSchema.safeParse(raw);
                if (!result.success) {
                    return { success: false, error: 'This file is not a valid deck.' };
                }
                const id = newId('imported');
                // `source`, `id` and `meta` are assigned here, never taken from
                // the file, so an import can't overwrite an existing deck or
                // claim authorship, a timestamp or a visibility it never had.
                const stored: DeckData = {
                    ...result.data,
                    id,
                    source: 'local',
                    type: 'vocab',
                    tags: [],
                    nsfw: false,
                    // Exported files carry `wordIds`; the deck model calls the
                    // same field `contentIds` because it spans all deck types.
                    contentIds: result.data.wordIds,
                    meta: newDeckMeta(),
                };
                set((state) =>
                    withDecks(state, language, [...(state.deckLists[language] ?? []), stored]),
                );
                return { success: true, id };
            },
        }),
        {
            name: 'choco-memo-deckListLocal',
            storage,
            partialize: (state) => ({
                deckLists: state.deckLists,
                passages: state.passages,
                questions: state.questions,
            }),
        },
    ),
);

/** The user's decks for a language. */
export function localDecks(language: Languages): DeckData[] {
    return useDeckListLocalStore.getState().deckLists[language] ?? [];
}

/** The user's decks of one type, e.g. every exam they own. */
export function localDecksOfType(language: Languages, type: DeckData['type']): DeckData[] {
    return localDecks(language).filter((deck) => deck.type === type);
}

/** Every stored question, built-in ones included. */
export function allQuestions(): ExamQuestion[] {
    return [...defaultExamQuestions(), ...useDeckListLocalStore.getState().questions];
}

/** Resolve an exam deck's `contentIds` to questions, mirroring
 *  `deckPassages`. A deck whose questions have been removed resolves to an
 *  empty list rather than throwing, so the session page can show its
 *  not-found state. */
export function deckQuestions(deck: DeckData): ExamQuestion[] {
    const all = allQuestions();
    return deck.contentIds
        .map((id) => all.find((q) => q.id === id))
        .filter((q): q is ExamQuestion => q != null);
}

/** Flattened questions from the built-in exam sets. */
function defaultExamQuestions(): ExamQuestion[] {
    return defaultExamSets.flatMap((set) => set.questions);
}

/** Every stored passage, built-in ones included. */
export function allPassages(): RenderPassage[] {
    return [...DEFAULT_PASSAGES, ...useDeckListLocalStore.getState().passages];
}

/** Resolve a render deck's `contentIds` to passages. */
export function deckPassages(deck: DeckData): RenderPassage[] {
    const all = allPassages();
    return deck.contentIds
        .map((id) => all.find((p) => p.id === id))
        .filter((p): p is RenderPassage => p != null);
}
