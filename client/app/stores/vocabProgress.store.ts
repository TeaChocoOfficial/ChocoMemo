// -Path: 'client/app/stores/vocabProgress.store.ts'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WordProgress {
    dueAt: number;
    easeFactor: number;
    reviewCount: number;
    intervalDays: number;
}

interface VocabProgressState {
    progress: Record<string, WordProgress>;
    recordPass: (wordId: string) => void;
    recordFail: (wordId: string) => void;
    getProgress: (wordId: string) => WordProgress;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PROGRESS: WordProgress = {
    dueAt: 0,
    reviewCount: 0,
    intervalDays: 0,
    easeFactor: 2.5,
};

export const useVocabProgressStore = create<VocabProgressState>()(
    persist(
        (set, get) => ({
            progress: {},
            getProgress: (wordId) => get().progress[wordId] ?? DEFAULT_PROGRESS,
            recordPass: (wordId) =>
                set((state) => {
                    const prev = state.progress[wordId] ?? DEFAULT_PROGRESS;
                    const reviewCount = prev.reviewCount + 1;
                    const intervalDays =
                        reviewCount === 1
                            ? 1
                            : reviewCount === 2
                              ? 3
                              : Math.round(prev.intervalDays * prev.easeFactor);
                    const easeFactor = Math.min(prev.easeFactor + 0.1, 3);

                    return {
                        progress: {
                            ...state.progress,
                            [wordId]: {
                                intervalDays,
                                easeFactor,
                                reviewCount,
                                dueAt: Date.now() + intervalDays * DAY_MS,
                            },
                        },
                    };
                }),
            recordFail: (wordId) =>
                set((state) => {
                    const prev = state.progress[wordId] ?? DEFAULT_PROGRESS;
                    return {
                        progress: {
                            ...state.progress,
                            [wordId]: {
                                intervalDays: 0,
                                easeFactor: Math.max(prev.easeFactor - 0.2, 1.3),
                                reviewCount: 0,
                                dueAt: Date.now(),
                            },
                        },
                    };
                }),
        }),
        { name: 'vocab-progress' },
    ),
);
