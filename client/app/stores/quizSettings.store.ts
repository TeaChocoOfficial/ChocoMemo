// -Path: 'client/app/stores/quizSettings.store.ts'
// Persists the kana drill settings (groups, question count, timer, auto-advance)
// so the user's choices are remembered across sessions.
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { QuizSettingsState } from '~/pages/japanese/kana-drill/components/setting/QuizSettings';

const DEFAULT_SETTINGS: QuizSettingsState = {
    hiragana: { voiceless: true, voiced: true, contracted: true },
    katakana: { voiceless: false, voiced: false, contracted: false },
    questionCount: 10,
    choiceCount: 4,
    timeLimit: 10,
    autoAdvance: false,
    useAll: false,
    mode: 'charToRomaji',
    soundEffect: 'voice',
    soundEffectVolume: 0.8,
};

interface QuizSettingsStore {
    settings: QuizSettingsState;
    setSettings: (settings: QuizSettingsState) => void;
    resetSettings: () => void;
}

export const useQuizSettingsStore = create<QuizSettingsStore>()(
    persist(
        (set) => ({
            settings: DEFAULT_SETTINGS,
            setSettings: (settings) => set({ settings }),
            resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
        }),
        {
            name: 'quiz-settings',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ settings: state.settings }),
            merge: (persisted, current) => ({
                ...current,
                settings: { ...DEFAULT_SETTINGS, ...(persisted as { settings?: QuizSettingsState }).settings },
            }),
        },
    ),
);