// -Path: 'client/app/stores/config/dockview.store.ts'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DockviewState {
    /** Adds a gap between the docked panels. */
    spaced: boolean;
    setSpaced: (spaced: boolean) => void;
}

/**
 * Persisted workspace preferences for the dockview editor. The theme itself is
 * not stored here: it follows the app theme, so only the layout options the app
 * theme cannot express live here.
 */
export const useDockviewStore = create<DockviewState>()(
    persist((set) => ({ spaced: false, setSpaced: (spaced) => set({ spaced }) }), {
        name: 'choco-memo-dockview',
    }),
);
