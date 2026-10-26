// -Path: 'client/app/stores/config/studyHub.store.ts'
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** Persisted state for the study hub's layout choices. */
interface StudyHubState {
    /** Whether the basics block (characters + drill) is collapsed. */
    basicHidden: boolean;
    toggleBasicHidden: () => void;
    /** Saves the basics visibility for the next visit. */
    setBasicHidden: (hidden: boolean) => void;
}

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined;

/**
 * The study hub's remembered layout. The basics block is the tallest part of the
 * hub, so a learner who already knows the script collapses it once and keeps
 * the deck shelf in view on every later visit.
 */
export const useStudyHubStore = create<StudyHubState>()(
    persist(
        (set) => ({
            basicHidden: false,
            setBasicHidden: (hidden) => set({ basicHidden: hidden }),
            toggleBasicHidden: () => set((state) => ({ basicHidden: !state.basicHidden })),
        }),
        {
            name: 'choco-memo-study-hub',
            storage,
            partialize: (state) => ({ basicHidden: state.basicHidden }),
        },
    ),
);
