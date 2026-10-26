// -Path: 'client/app/stores/config/pinnedTabs.store.ts'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** State and actions for the pinned editor tabs. */
interface PinnedTabsState {
    /** Ids of the pinned editor tabs, in pin order. */
    pinnedIds: string[];
    unpin: (id: string) => void;
    toggle: (id: string) => void;
    prune: (ids: string[]) => void;
}

/**
 * Persisted set of pinned editor tabs. The free dockview build has no
 * pinned-tabs module (`api.isPinned` is always false), so the workspace keeps
 * the ids here and orders the tabs itself.
 */
export const usePinnedTabsStore = create<PinnedTabsState>()(
    persist(
        (set) => ({
            pinnedIds: [],
            /** Removes an id from the pinned set. */
            unpin: (id) =>
                set((state) => ({ pinnedIds: state.pinnedIds.filter((item) => item !== id) })),
            /** Pins an id, or unpins it when it is already pinned. */
            toggle: (id) =>
                set((state) => ({
                    pinnedIds: state.pinnedIds.includes(id)
                        ? state.pinnedIds.filter((item) => item !== id)
                        : [...state.pinnedIds, id],
                })),
            /** Keeps only the ids that still exist, preserving their order. */
            prune: (ids) =>
                set((state) => ({ pinnedIds: state.pinnedIds.filter((id) => ids.includes(id)) })),
        }),
        { name: 'choco-memo-pinned-tabs' },
    ),
);
