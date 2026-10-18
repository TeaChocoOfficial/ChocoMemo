// -Path: 'client/app/stores/en/alphabetProgress.store.ts'
// Tracks the last-read letter per set:group so the one-by-one reading
// resumes from where the user left off instead of starting over. The
// English twin of `stores/japanese/kanaProgress.store.ts`.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AlphabetProgressState {
    // key: `${AlphabetSetId}:vowels|consonants` -> index of the last spoken letter
    progress: Record<string, number>;
    recordRead: (key: string, index: number) => void;
    getProgress: (key: string) => number;
}

export const useAlphabetProgressStore = create<AlphabetProgressState>()(
    persist(
        (set, get) => ({
            progress: {},
            recordRead: (key, index) =>
                set((state) => ({ progress: { ...state.progress, [key]: index } })),
            getProgress: (key) => get().progress[key] ?? 0,
        }),
        { name: 'alphabet-reading-progress' },
    ),
);
