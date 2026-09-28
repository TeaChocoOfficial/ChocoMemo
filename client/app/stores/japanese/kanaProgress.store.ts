// -Path: 'client/app/stores/kanaProgress.store.ts'
// Tracks the last-read kana per set:group so the one-by-one reading
// resumes from where the user left off instead of starting over.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface KanaProgressState {
    // key: `${KanaSetId}:${keyof KanaChars}` -> index of the last spoken kana
    progress: Record<string, number>;
    recordRead: (key: string, index: number) => void;
    getProgress: (key: string) => number;
}

export const useKanaProgressStore = create<KanaProgressState>()(
    persist(
        (set, get) => ({
            progress: {},
            recordRead: (key, index) =>
                set((state) => ({ progress: { ...state.progress, [key]: index } })),
            getProgress: (key) => get().progress[key] ?? 0,
        }),
        { name: 'kana-reading-progress' },
    ),
);