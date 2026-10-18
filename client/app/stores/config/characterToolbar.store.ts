// -Path: 'client/app/stores/config/characterToolbar.store.ts'
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ActiveGroups, ActiveSet, CharLang } from '~/types/characters';

/** What a first-time visitor's chart toolbar opens with: not pinned. */
export const DEFAULT_CHART_STICKY = false;

/** Persisted state for the character charts' toolbar. */
interface CharacterToolbarState {
    activeSets: ActiveSet;
    activeGroups: ActiveGroups;
    /** Whether the chart toolbar sticks to the viewport while scrolling. */
    stickyEnabled: boolean;
    /** Saves the sticky preference for the next visit. */
    setStickyEnabled: (enabled: boolean) => void;
    getActiveSet: <Lang extends CharLang>(lang: Lang) => ActiveSet[Lang];
    getActiveGroup: <Lang extends CharLang>(lang: Lang) => ActiveGroups[Lang];
    setActiveSet: <Lang extends CharLang>(lang: Lang, value: ActiveSet[Lang]) => void;
    setActiveGroup: <Lang extends CharLang>(lang: Lang, value: ActiveGroups[Lang]) => void;
}

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined;

/**
 * The chart toolbar's sticky preference, shared by every character chart page
 * (kana and alphabet) and remembered across visits, so pinning the toolbar
 * once applies to both charts and survives a reload.
 */
export const useCharacterToolbarStore = create<CharacterToolbarState>()(
    persist(
        (set, get) => ({
            activeSets: { en: 'uppercase', ja: 'hiragana' },
            activeGroups: { en: 'consonants', ja: 'contracted' },
            stickyEnabled: DEFAULT_CHART_STICKY,
            getActiveSet: (lang) => get().activeSets[lang],
            getActiveGroup: (lang) => get().activeGroups[lang],
            setStickyEnabled: (enabled) => set({ stickyEnabled: enabled }),
            setActiveSet: (lang, value) =>
                set((state) => ({ ...state, activeSets: { ...state.activeSets, [lang]: value } })),
            setActiveGroup: (lang, value) => {
                set((state) => ({
                    ...state,
                    activeGroups: { ...state.activeGroups, [lang]: value },
                }));
            },
        }),
        {
            name: 'choco-memo-chacter-toolbar',
            storage,
            partialize: (state) => ({ stickyEnabled: state.stickyEnabled }),
        },
    ),
);
