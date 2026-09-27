// Local-first store for user-created reading decks and passages.
// Mirrors deck.store: the built-in set lives in data/, the store holds only
// what the user adds, persisted to localStorage.
import { create } from 'zustand';
import type { RenderDeck, RenderPassage } from '~/types/render';
import { DEFAULT_RENDER_DECKS } from '~/data/japanese/renderDecks';
import { DEFAULT_PASSAGES } from '~/data/japanese/renderPassages';
import { persist, createJSONStorage } from 'zustand/middleware';

const storage =
    typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined;

const newId = (prefix: string) =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

interface RenderState {
    decks: RenderDeck[];
    passages: RenderPassage[];
    addDeck: (deck: Omit<RenderDeck, 'id' | 'source'>) => void;
    removeDeck: (id: string) => void;
    addPassage: (passage: Omit<RenderPassage, 'id'>) => void;
    updatePassage: (id: string, passage: Omit<RenderPassage, 'id'>) => void;
    removePassage: (id: string) => void;
}

export const useRenderStore = create<RenderState>()(
    persist(
        (set) => ({
            decks: [],
            passages: [],
            addDeck: (deck) =>
                set((state) => ({ decks: [...state.decks, { ...deck, id: newId('render'), source: 'local' }] })),
            removeDeck: (id) =>
                set((state) => ({
                    // Drop the deck's passages too, otherwise they become
                    // orphans that no deck can reach.
                    passages: state.passages.filter((p) => {
                        const deck = state.decks.find((d) => d.id === id);
                        return !deck?.passageIds.includes(p.id);
                    }),
                    decks: state.decks.filter((d) => d.id !== id),
                })),
            addPassage: (passage) =>
                set((state) => ({
                    passages: [...state.passages, { ...passage, id: newId('p') }],
                })),
            updatePassage: (id, passage) =>
                set((state) => ({
                    passages: state.passages.map((p) => (p.id === id ? { ...passage, id } : p)),
                })),
            removePassage: (id) =>
                set((state) => ({
                    passages: state.passages.filter((p) => p.id !== id),
                    // Unlink from any deck that referenced it.
                    decks: state.decks.map((d) =>
                        d.passageIds.includes(id)
                            ? { ...d, passageIds: d.passageIds.filter((p) => p !== id) }
                            : d,
                    ),
                })),
        }),
        {
            name: 'choco-render',
            storage,
            partialize: (state) => ({ decks: state.decks, passages: state.passages }),
        },
    ),
);

/** All reading decks: built-in first, then the user's own. */
export function allRenderDecks(): RenderDeck[] {
    return [...DEFAULT_RENDER_DECKS, ...useRenderStore.getState().decks];
}

/** Resolve a deck's passages across built-in and user content. */
export function deckPassages(deck: RenderDeck): RenderPassage[] {
    const all = [...DEFAULT_PASSAGES, ...useRenderStore.getState().passages];
    return deck.passageIds
        .map((id) => all.find((p) => p.id === id))
        .filter((p): p is RenderPassage => p != null);
}

export function findRenderDeck(id: string): RenderDeck | undefined {
    return allRenderDecks().find((d) => d.id === id);
}
