// Local-first store for user-added custom vocabulary.
// Wraps the persisted vocabulary words, including defaults merged at hydrate time.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { VocabWord } from '~/types/vocabulary';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';

interface VocabularyState {
    custom: VocabWord[];
    addCustom: (word: Omit<VocabWord, 'id'>) => void;
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
            addCustom: (word) =>
                set((state) => ({
                    custom: [
                        ...state.custom,
                        { ...word, id: `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}` },
                    ],
                })),
            removeCustom: (id) =>
                set((state) => ({
                    custom: state.custom.filter((w) => w.id !== id),
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
