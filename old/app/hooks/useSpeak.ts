// -Path: 'client/app/hooks/useSpeak.ts'
// Speaks a given text using the browser's Web Speech API.
// Respects the user's chosen voice from the speech store.
// Falls back gracefully when speech synthesis is unavailable.
//
// Optionally accepts a pre-generated static audio file (e.g. VOICEVOX) via
// the second argument — when present it is played instead, and only falls
// back to speech synthesis if the file fails to load.

import { useCallback } from 'react';
import { useSpeechStore } from '~/stores/config/speech.store';

// The most recently played static audio file, so any caller can stop the
// current reading without holding onto its own Audio element.
let activeAudio: HTMLAudioElement | null = null;

/** Cancel any in-progress speech (Web Speech API + static audio files). */
export function stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    if (activeAudio) {
        activeAudio.pause();
        activeAudio = null;
    }
}

function getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    return window.speechSynthesis.getVoices();
}

function pickJapaneseVoice(): SpeechSynthesisVoice | null {
    const voices = getVoices();
    return voices.find((v) => v.lang.toLowerCase().startsWith('ja')) ?? null;
}

export function getVoiceForSpeech(voiceURI: string): SpeechSynthesisVoice | null {
    const selected = voiceURI ? getVoices().find((v) => v.voiceURI === voiceURI) ?? null : null;
    return selected ?? pickJapaneseVoice();
}

export function useSpeak() {
    const voiceURI = useSpeechStore((s) => s.voiceURI);
    const lang = useSpeechStore((s) => s.lang);
    const rate = useSpeechStore((s) => s.rate);
    const volume = useSpeechStore((s) => s.volume);

    return useCallback(
        (text: string, audioSrc?: string, onEnd?: () => void) => {
            if (typeof window === 'undefined') return;

            stopSpeaking();

            if (audioSrc) {
                const audio = new Audio(audioSrc);
                activeAudio = audio;
                audio.onended = () => {
                    if (activeAudio === audio) activeAudio = null;
                    onEnd?.();
                };
                audio.onerror = () => {
                    if (activeAudio === audio) activeAudio = null;
                    speakWithTTS(text, onEnd);
                };
                audio.play().catch(() => {
                    if (activeAudio === audio) activeAudio = null;
                    speakWithTTS(text, onEnd);
                });
                return;
            }
            speakWithTTS(text, onEnd);
        },
        [voiceURI, lang, rate, volume],
    );

    function speakWithTTS(text: string, onEnd?: () => void) {
        if (!('speechSynthesis' in window)) {
            onEnd?.();
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.volume = volume;
        utterance.pitch = 1;

        const selected = getVoiceForSpeech(voiceURI);
        if (selected) utterance.voice = selected;
        if (onEnd) utterance.onend = onEnd;

        window.speechSynthesis.speak(utterance);
    }
}

