// -Path: 'client/app/hooks/base/useTtsVoices.ts'
import { useCallback, useEffect, useRef, useState } from 'react';
import ttsAPI from '~/services/tts';
import type { TtsVoice } from '~/services/tts';

/** Voice lists already fetched, keyed by language tag. */
const voiceCache = new Map<string, TtsVoice[]>();

/** Voice requests in flight, keyed by language tag, so the picker and the
 *  chart on the same page wait for ONE request instead of firing two. */
const voiceRequests = new Map<string, Promise<TtsVoice[]>>();

/**
 * The Google voices for a language, fetched once and shared by every
 * consumer on the page.
 *
 * @param languageCode - BCP47 tag, e.g. `th-TH`.
 * @returns The voice list for that language.
 */
async function fetchVoices(languageCode: string): Promise<TtsVoice[]> {
    const cached = voiceCache.get(languageCode);
    if (cached) return cached;

    const pending = voiceRequests.get(languageCode);
    if (pending) return pending;

    const request = ttsAPI
        .voices(languageCode)
        .then((res) => {
            voiceCache.set(languageCode, res.data);
            return res.data;
        })
        .catch((error: unknown) => {
            // A failed request is not cached: the server may be missing its
            // Google key for now, and a later reload must try again.
            voiceCache.delete(languageCode);
            throw error;
        })
        .finally(() => {
            voiceRequests.delete(languageCode);
        });

    voiceRequests.set(languageCode, request);
    return request;
}

/**
 * The voice to speak a language with: the learner's pick while Google still
 * offers it, else the first voice of the list, else none at all.
 *
 * @param voices - The voices Google offers for the language.
 * @param storedVoiceName - The voice the learner picked, if any.
 * @returns A Google voice name, or an empty string when there is none.
 */
export function resolveVoiceName(voices: TtsVoice[], storedVoiceName: string): string {
    if (storedVoiceName && voices.some((voice) => voice.name === storedVoiceName))
        return storedVoiceName;
    return voices[0]?.name ?? '';
}

/** The Google voices of one language, with the request state around them. */
export interface TtsVoicesState {
    /** The voices Google offers for the language. */
    voices: TtsVoice[];
    /** The list is being fetched. */
    loading: boolean;
    /** The list could not be fetched (no Google key on the server, ...). */
    failed: boolean;
    /** Fetches the list again, ignoring the cached one. */
    reload: () => void;
}

/**
 * The Google Cloud TTS voices of one language. The list is fetched once per
 * language and shared between every consumer of the page, so the voice
 * picker and the character chart cost a single request together.
 *
 * @param languageCode - BCP47 tag, e.g. `th-TH`.
 * @returns The voices, the loading / failed state, and a reload function.
 */
export function useTtsVoices(languageCode: string): TtsVoicesState {
    const [voices, setVoices] = useState<TtsVoice[]>(() => voiceCache.get(languageCode) ?? []);
    const [loading, setLoading] = useState(() => !voiceCache.has(languageCode));
    const [failed, setFailed] = useState(false);
    const [requestKey, setRequestKey] = useState(0);
    /** The language the current list belongs to, so a switch never shows the
     *  voices of the previous language. */
    const loadedLanguage = useRef(languageCode);

    useEffect(() => {
        let active = true;
        if (loadedLanguage.current !== languageCode) {
            loadedLanguage.current = languageCode;
            setVoices([]);
        }
        setLoading(true);
        setFailed(false);

        fetchVoices(languageCode)
            .then((list) => {
                if (!active) return;
                setVoices(list);
                setLoading(false);
            })
            .catch(() => {
                if (!active) return;
                setVoices([]);
                setLoading(false);
                setFailed(true);
            });

        return () => {
            active = false;
        };
    }, [languageCode, requestKey]);

    const reload = useCallback(() => {
        // Dropping the cached list is what makes the next fetch bypass it.
        voiceCache.delete(languageCode);
        voiceRequests.delete(languageCode);
        setRequestKey((key) => key + 1);
    }, [languageCode]);

    return { voices, loading, failed, reload };
}
