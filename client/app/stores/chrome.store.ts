// -Path: 'client/app/stores/chrome.store.ts'
// Toggles global chrome (navbar & footer) visibility across the app.
// Persisted so the user's preference is remembered across sessions.
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ChromeState {
    showChrome: boolean;
    toggleChrome: () => void;
    setShowChrome: (show: boolean) => void;
}

export const useChromeStore = create<ChromeState>()(
    persist(
        (set) => ({
            showChrome: true,
            toggleChrome: () => set((s) => ({ showChrome: !s.showChrome })),
            setShowChrome: (showChrome) => set({ showChrome }),
        }),
        {
            name: 'chrome-visibility',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ showChrome: state.showChrome }),
        },
    ),
);