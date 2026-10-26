// -Path: 'client/app/hooks/useSpeak.ts'
// Speaks a given text using the browser's Web Speech API.
// The spoken language follows the active target language, never the UI locale.
// Falls back gracefully when speech synthesis is unavailable.
//
// Optionally accepts a pre-generated static audio file (e.g. VOICEVOX) via
// the second argument — when present it is played instead, and only falls
// back to speech synthesis if the file fails to load.

import { useCallback } from 'react';
import { useTargetLang } from '~/hooks/base/useTargetLang';
import { targetSpeechLang } from '~/utils/config/targetLang';
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

/** The first installed voice for a BCP47 tag's language, or `null`. */
function pickVoiceForLang(lang: string): SpeechSynthesisVoice | null {
    const base = lang.toLowerCase().split('-')[0];
    return getVoices().find((v) => v.lang.toLowerCase().startsWith(base)) ?? null;
}

/** The voice to speak with: the viewer's pick when it speaks the requested
 *  language, else the first installed voice for that language. The stored
 *  pick can belong to another language (a ja voice saved on the kana chart
 *  would mispronounce Thai), so its base language must match. */
export function getVoiceForSpeech(voiceURI: string, lang: string): SpeechSynthesisVoice | null {
    const base = lang.toLowerCase().split('-')[0];
    const selected = voiceURI ? (getVoices().find((v) => v.voiceURI === voiceURI) ?? null) : null;
    if (selected && selected.lang.toLowerCase().startsWith(base)) return selected;
    return pickVoiceForLang(lang);
}

/**
 * @param speechLangOverride BCP47 tag to speak with, overriding the active
 * target language. Deck sessions pass `deck.targetInfo.speechTag` here so an
 * `other` deck speaks its own language.
 */
export function useSpeak(speechLangOverride?: string) {
    const targetLang = useTargetLang();
    const { rate, volume, voiceURI } = useSpeechStore();
    const speechLang = speechLangOverride ?? targetSpeechLang(targetLang);

    return useCallback(
        (text: string, audioSrc?: string, onEnd?: () => void) => {
            if (typeof window === 'undefined') return;

            stopSpeaking();

            if (audioSrc) {
                const audio = new Audio(audioSrc);
                audio.volume = volume;
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
            // speakWithTTS(text, onEnd);
        },
        [voiceURI, speechLang, rate, volume],
    );

    function speakWithTTS(text: string, onEnd?: () => void) {
        if (!('speechSynthesis' in window)) {
            onEnd?.();
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = speechLang;
        utterance.rate = rate;
        utterance.volume = volume;
        utterance.pitch = 1;

        const selected = getVoiceForSpeech(voiceURI, speechLang);
        if (selected) {
            utterance.voice = selected;
            utterance.lang = selected.lang;
        }
        if (onEnd) utterance.onend = onEnd;

        window.speechSynthesis.speak(utterance);
    }
}
