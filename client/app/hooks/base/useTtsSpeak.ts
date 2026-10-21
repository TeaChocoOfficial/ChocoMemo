// -Path: 'client/app/hooks/base/useTtsSpeak.ts'
import { useCallback } from 'react';
import ttsAPI from '~/services/tts';
import { stopSpeaking } from '~/hooks/base/useSpeak';
import { useSpeechStore } from '~/stores/config/speech.store';

/** The most recent Google TTS audio element, so a new call can stop it. */
let activeTtsAudio: HTMLAudioElement | null = null;

/** The object URL of the clip that is sounding right now, so the cache never
 *  revokes a URL that is still playing. */
let activeAudioUrl: string | null = null;

/** Synthesized clips by `languageCode|voiceName|text`: tapping the same
 *  character twice must not call the API twice. */
const audioCache = new Map<string, string>();

/** How many clips stay cached before the oldest one is dropped. */
const AUDIO_CACHE_LIMIT = 40;

/** Drop the oldest cached clip and release its object URL. */
function evictOldestClip(): boolean {
    for (const [key, url] of audioCache) {
        // The clip that is sounding right now has to stay alive.
        if (url === activeAudioUrl) continue;
        audioCache.delete(key);
        URL.revokeObjectURL(url);
        return true;
    }
    return false;
}

/** Keep a synthesized clip and free the oldest ones. */
function cacheAudio(key: string, url: string): void {
    audioCache.set(key, url);
    while (audioCache.size > AUDIO_CACHE_LIMIT) {
        if (!evictOldestClip()) return;
    }
}

/** Cancel any in-progress Google TTS playback. */
export function stopTtsSpeaking() {
    if (activeTtsAudio) {
        activeTtsAudio.pause();
        activeTtsAudio = null;
        activeAudioUrl = null;
    }
}

/**
 * Speak text with a Google Cloud TTS voice (via the server proxy). The audio
 * is fetched as an MP3 blob and played; the browser's own voices are never
 * used, so the pronunciation is the same on every device.
 *
 * @returns A `speak(text, languageCode, voiceName, onEnd?)` function.
 */
export function useTtsSpeak() {
    const volume = useSpeechStore((state) => state.volume);

    return useCallback(
        async (text: string, languageCode: string, voiceName: string, onEnd?: () => void) => {
            if (typeof window === 'undefined') return;

            stopSpeaking();
            stopTtsSpeaking();

            const cacheKey = `${languageCode}|${voiceName}|${text}`;

            try {
                let url = audioCache.get(cacheKey) ?? '';
                if (!url) {
                    const res = await ttsAPI.synthesize(text, languageCode, voiceName);
                    url = URL.createObjectURL(res.data);
                    cacheAudio(cacheKey, url);
                }

                const audio = new Audio(url);
                audio.volume = volume;
                activeTtsAudio = audio;
                activeAudioUrl = url;

                const cleanup = () => {
                    if (activeTtsAudio === audio) {
                        activeTtsAudio = null;
                        activeAudioUrl = null;
                    }
                };

                audio.onended = () => {
                    cleanup();
                    onEnd?.();
                };
                audio.onerror = cleanup;

                await audio.play();
            } catch {
                onEnd?.();
            }
        },
        [volume],
    );
}
