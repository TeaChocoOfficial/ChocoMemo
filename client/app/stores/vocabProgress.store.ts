// -Path: 'client/app/stores/vocabProgress.store.ts'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Per-word spaced-repetition progress. Persisted locally so scheduling
 *  survives page reloads/closing the app between sessions. */
interface WordProgress {
    intervalDays: number;
    easeFactor: number;
    dueAt: number; // epoch ms
    reviewCount: number;
}

interface VocabProgressState {
    progress: Record<string, WordProgress>;
    getProgress: (wordId: string) => WordProgress;
    recordPass: (wordId: string) => void;
    recordFail: (wordId: string) => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PROGRESS: WordProgress = {
    intervalDays: 0,
    easeFactor: 2.5,
    dueAt: 0,
    reviewCount: 0,
};

export const useVocabProgressStore = create<VocabProgressState>()(
    persist(
        (set, get) => ({
            progress: {},

            getProgress: (wordId) => get().progress[wordId] ?? DEFAULT_PROGRESS,

            /** Correct answer: push the word further out. First success = 1 day,
             *  second = 3 days, then grows by the ease factor each time after. */
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

            /** Wrong answer: reset the learning progress and lower the ease
             *  factor slightly (the word was "harder" than assumed). dueAt is
             *  set to now — the in-session requeue (see useVocabularySession)
             *  handles resurfacing it soon; this just makes sure it's also
             *  due again immediately in any future session. */
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
