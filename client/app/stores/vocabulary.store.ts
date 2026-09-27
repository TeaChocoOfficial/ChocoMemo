// Local-first store for user-added custom vocabulary.
// Wraps the persisted vocabulary words, including defaults merged at hydrate time.
import { create } from 'zustand';
import type { VocabWord } from '~/types/vocabulary';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { persist, createJSONStorage } from 'zustand/middleware';

interface VocabularyState {
    custom: VocabWord[];
    /** Returns the generated id so callers can link the word to a deck. */
    addCustom: (word: Omit<VocabWord, 'id'>) => string;
    updateCustom: (id: string, word: Omit<VocabWord, 'id'>) => void;
    removeCustom: (id: string) => void;
    clearCustom: () => void;
    /**
     * All words available: built-in defaults plus user custom words.
     * Derived by the consuming component; kept here for convenience.
     */
    all: () => VocabWord[];
}

const storage =
    typeof window !== 'undefined'
        ? createJSONStorage(() => localStorage)
        : undefined;

export const useVocabularyStore = create<VocabularyState>()(
    persist(
        (set, get) => ({
            custom: [],
            addCustom: (word) => {
                const id = `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
                set((state) => ({ custom: [...state.custom, { ...word, id }] }));
                return id;
            },
            removeCustom: (id) =>
                set((state) => ({
                    custom: state.custom.filter((w) => w.id !== id),
                })),
            // Only user words are editable; the built-in defaults ship with the
            // app. Silently ignoring an unknown id keeps a stale browser tab
            // from throwing when the word was deleted in another one.
            updateCustom: (id, word) =>
                set((state) => ({
                    custom: state.custom.map((w) => (w.id === id ? { ...word, id } : w)),
                })),
            clearCustom: () => set({ custom: [] }),
            all: () => [...DEFAULT_VOCABULARY, ...get().custom],
        }),
        {
            name: 'choco-vocabulary',
            storage,
            partialize: (state) => ({ custom: state.custom }),
        },
    ),
);
