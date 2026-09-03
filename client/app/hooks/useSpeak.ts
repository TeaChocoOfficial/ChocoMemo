// -Path: 'client/app/hooks/useSpeak.ts'
// Speaks a given text using the browser's Web Speech API.
// Respects the user's chosen voice from the speech store.
// Falls back gracefully when speech synthesis is unavailable.

import { useCallback } from 'react';
import { useSpeechStore } from '~/stores/speech.store';

function getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices();
}

function pickJapaneseVoice(): SpeechSynthesisVoice | null {
    const voices = getVoices();
    return voices.find((v) => v.lang.toLowerCase().startsWith('ja')) ?? null;
}

export function useSpeak() {
    const voiceURI = useSpeechStore((s) => s.voiceURI);
    const lang = useSpeechStore((s) => s.lang);
    const rate = useSpeechStore((s) => s.rate);

    return useCallback(
        (text: string) => {
            if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = rate;
            utterance.pitch = 1;

            let selected: SpeechSynthesisVoice | null = null;
            if (voiceURI) {
                selected = getVoices().find((v) => v.voiceURI === voiceURI) ?? null;
            }
            if (!selected) selected = pickJapaneseVoice();
            if (selected) utterance.voice = selected;

            window.speechSynthesis.speak(utterance);
        },
        [voiceURI, lang, rate],
    );
}

