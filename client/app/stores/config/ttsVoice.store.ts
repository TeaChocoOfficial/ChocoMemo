// -Path: 'client/app/stores/config/ttsVoice.store.ts'
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** The Google Cloud TTS voice picked per language. */
export interface TtsVoiceState {
    /** Chosen voice name per language tag, e.g. `{ 'th-TH': 'th-TH-Neural2-A' }`. */
    voices: Record<string, string>;
    /** Picks the voice to speak a language with. */
    setVoice: (languageCode: string, voiceName: string) => void;
    /** Forgets the pick for a language, so the next available voice is used. */
    resetVoice: (languageCode: string) => void;
}

/**
 * The learner's Google Cloud TTS pick, per language. A pick survives a
 * reload, so the chart always speaks with the voice the learner chose.
 */
export const useTtsVoiceStore = create<TtsVoiceState>()(
    persist(
        (set) => ({
            voices: {},
            setVoice: (languageCode, voiceName) =>
                set((state) =>
                    // Re-picking the same voice changes nothing, so subscribers
                    // (every card on the chart) are not woken up for it.
                    state.voices[languageCode] === voiceName
                        ? state
                        : { voices: { ...state.voices, [languageCode]: voiceName } },
                ),
            resetVoice: (languageCode) =>
                set((state) => {
                    if (!(languageCode in state.voices)) return state;
                    const voices = { ...state.voices };
                    delete voices[languageCode];
                    return { voices };
                }),
        }),
        {
            name: 'tts-voice',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                voices: state.voices,
            }),
        },
    ),
);
