// -Path: 'client/app/stores/readProgress.store.ts'
// Tracks the last-read read per set:group so the one-by-one reading
// resumes from where the user left off instead of starting over.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReadProgressState {
    // key: `${ReadSetId}:${keyof ReadChars}` -> index of the last spoken read
    progress: Record<string, number>;
    recordRead: (key: string, index: number) => void;
    getProgress: (key: string) => number;
}

export const useReadProgressStore = create<ReadProgressState>()(
    persist(
        (set, get) => ({
            progress: {},
            recordRead: (key, index) =>
                set((state) => ({ progress: { ...state.progress, [key]: index } })),
            getProgress: (key) => get().progress[key] ?? 0,
        }),
        { name: 'character-reading-progress' },
    ),
);
