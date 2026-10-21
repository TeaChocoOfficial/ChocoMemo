// -Path: 'client/app/stores/speech.store.ts'
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SpeechState {
    voiceURI: string;
    rate: number;
    volume: number;
    setVoice: (voiceURI: string) => void;
    setRate: (rate: number) => void;
    setVolume: (volume: number) => void;
    resetVoice: () => void;
}

export const useSpeechStore = create<SpeechState>()(
    persist(
        (set) => ({
            voiceURI: '',
            rate: 0.9,
            volume: 1,
            setVoice: (voiceURI) => set({ voiceURI }),
            setRate: (rate) => set({ rate }),
            setVolume: (volume) => set({ volume }),
            resetVoice: () => set({ voiceURI: '' }),
        }),
        {
            name: 'speech-voice',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                voiceURI: state.voiceURI,
                rate: state.rate,
                volume: state.volume,
            }),
        },
    ),
);
