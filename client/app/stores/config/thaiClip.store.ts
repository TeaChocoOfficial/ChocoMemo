// -Path: 'client/app/stores/config/thaiClip.store.ts'
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ThaiClipVoice } from '~/utils/characters/thaiClip';

export interface ThaiClipState {
    /** The clip voice the Thai chart speaks with. */
    voice: ThaiClipVoice;
    /** Picks the clip voice. */
    setVoice: (voice: ThaiClipVoice) => void;
}

/**
 * The Thai chart's clip voice: the pre-rendered Thai speech used when the
 * server cannot reach Google Cloud TTS. A pick survives a reload.
 */
export const useThaiClipStore = create<ThaiClipState>()(
    persist(
        (set) => ({
            voice: 'female',
            setVoice: (voice) => set({ voice }),
        }),
        {
            name: 'thai-clip-voice',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                voice: state.voice,
            }),
        },
    ),
);
