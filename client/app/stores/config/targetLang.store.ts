// -Path: 'client/app/stores/config/targetLang.store.ts'
import { create } from 'zustand';
import { Languages } from '~/data/language';
import { createJSONStorage, persist } from 'zustand/middleware';

/** The target language a first-time visitor studies. */
export const DEFAULT_TARGET_LANG = Languages.ja;

const storage = typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined;

interface TargetLangState {
    /** The last target language the viewer chose, used when the URL carries no
     *  `?target=` filter. */
    targetLang: Languages;
    setTargetLang: (targetLang: Languages) => void;
}

/**
 * Persisted target-language choice. The URL's `?target=` wins when present;
 * this store is the fallback so a bare `/:lang/vocab` still opens the language
 * the viewer was last studying.
 */
export const useTargetLangStore = create<TargetLangState>()(
    persist(
        (set) => ({
            targetLang: DEFAULT_TARGET_LANG,
            setTargetLang: (targetLang) => set({ targetLang }),
        }),
        {
            name: 'choco-memo-target-lang',
            storage,
            partialize: (state) => ({ targetLang: state.targetLang }),
        },
    ),
);
