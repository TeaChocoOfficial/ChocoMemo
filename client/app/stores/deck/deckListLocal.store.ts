// Local-first store for deck lists the user owns or edits on-device.
// One store for every deck type (vocab / render / review / exam), keyed by
// language id, so the deck-list pages read from a single place. The
// server-synced counterpart is `deckList.store.ts`; the content these decks
// reference (words, passages) lives in its own store.
import { create } from 'zustand';
import { Languages } from '~/data/language';
import { newDeckMeta } from '~/utils/deck/deckMeta';
import type { ExamQuestion } from '~/types/deck/exam';
import { importedDeckSchema } from '~/utils/deck/deck';
import type { DeckData, DeckLists, DeckMeta } from '~/types/deck';
import type { RenderPassage } from '~/types/deck/render';
import { DEFAULT_PASSAGES } from '~/data/ja/renderPassages';
import { createJSONStorage, persist } from 'zustand/middleware';

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
    /** Files a new deck. The store stamps the id, the meta and the language;
     *  the source, order and content come from the author. `meta` overrides the
     *  defaults stamped on creation (e.g. the visibility they picked). */
    addDeck: (
        language: Languages,
        deck: Omit<DeckData, 'id' | 'meta' | 'targetLang'>,
        meta?: Partial<DeckMeta>,
    ) => string;
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

            addDeck: (language, deck, meta) => {
                const id = newId(deck.type);
                // Meta is stamped here rather than by the caller: the store is
                // the only place that knows a deck was just created, so no
                // caller can hand in a stale or borrowed byline.
                const stored: DeckData = {
                    ...deck,
                    id,
                    meta: { ...newDeckMeta(), ...meta },
                    targetLang: language,
                };
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
                    id,
                    name: result.data.name,
                    description: result.data.description,
                    source: 'local',
                    type: 'vocab',
                    tags: [],
                    nsfw: false,
                    index: 0,
                    contentIds: result.data.wordIds,
                    meta: newDeckMeta(),
                    targetLang: language,
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

/** Every question the user has built or imported. */
export function allQuestions(): ExamQuestion[] {
    return [...useDeckListLocalStore.getState().questions];
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
