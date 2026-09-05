// -Path: 'client/app/stores/speech.store.ts'
// Persists the user's preferred SpeechSynthesis voice (per device, stored in localStorage).
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SpeechState {
    // voiceURI of the selected SpeechSynthesisVoice (empty = auto / default Japanese voice)
    voiceURI: string;
    lang: string;
    rate: number;
    volume: number;
    setVoice: (voiceURI: string, lang: string) => void;
    setRate: (rate: number) => void;
    setVolume: (volume: number) => void;
    resetVoice: () => void;
}

export const useSpeechStore = create<SpeechState>()(
    persist(
        (set) => ({
            voiceURI: '',
            lang: 'ja-JP',
            rate: 0.9,
            volume: 1,
            setVoice: (voiceURI, lang) => set({ voiceURI, lang }),
            setRate: (rate) => set({ rate }),
            setVolume: (volume) => set({ volume }),
            resetVoice: () => set({ voiceURI: '', lang: 'ja-JP' }),
        }),
        {
            name: 'speech-voice',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                voiceURI: state.voiceURI,
                lang: state.lang,
                rate: state.rate,
                volume: state.volume,
            }),
        },
    ),
);
