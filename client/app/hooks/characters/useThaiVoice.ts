// -Path: 'client/app/hooks/characters/useThaiVoice.ts'
import { useCallback } from 'react';
import { useSpeak } from '~/hooks/base/useSpeak';
import { useTtsSpeak } from '~/hooks/base/useTtsSpeak';
import { thaiClipUrl } from '~/utils/characters/thaiClip';
import type { ThaiClipVoice } from '~/utils/characters/thaiClip';
import { useTtsVoiceStore } from '~/stores/config/ttsVoice.store';
import { useThaiClipStore } from '~/stores/config/thaiClip.store';
import { resolveVoiceName, useTtsVoices } from '~/hooks/base/useTtsVoices';

/** The BCP47 tag Google names the Thai voices with. */
const THAI_LANGUAGE_CODE = 'th-TH';

/** The Thai voice of the chart. */
export interface ThaiVoice {
    /** BCP47 tag of the language, e.g. `th-TH`. */
    languageCode: string;
    /** The Google voice in use, empty when none is available. */
    voiceName: string;
    /** The clip voice used when Google Cloud TTS is not available. */
    clipVoice: ThaiClipVoice;
    /** Speaks a Thai character with the best voice available. */
    speak: (sound: string, text: string) => void;
}

/**
 * The Thai voice of the chart, in three tiers: the Google Cloud TTS voice the
 * learner picked (every voice Google offers), then the pre-rendered Thai clip
 * the app ships (a real Thai voice, no Google key needed), and only then the
 * browser's own voice.
 *
 * @returns The language, the voices and a `speak(char, text)` function.
 */
export function useThaiVoice(): ThaiVoice {
    const { voices } = useTtsVoices(THAI_LANGUAGE_CODE);
    const storedVoice = useTtsVoiceStore((state) => state.voices[THAI_LANGUAGE_CODE] ?? '');
    const clipVoice = useThaiClipStore((state) => state.voice);
    const speakTts = useTtsSpeak();
    const speakBrowser = useSpeak(THAI_LANGUAGE_CODE);

    const voiceName = resolveVoiceName(voices, storedVoice);

    const speak = useCallback(
        (sound: string, text: string) => {
            // Google Cloud TTS first: the pick the learner made.
            if (voiceName) {
                speakTts(text, THAI_LANGUAGE_CODE, voiceName);
                return;
            }
            // The pre-rendered clip next: Thai speech without a Google key.
            const clip = thaiClipUrl(sound, clipVoice);
            if (clip) {
                speakBrowser(text, clip);
                return;
            }
            // The browser voice last: it is the only one left.
            speakBrowser(text);
        },
        [speakBrowser, speakTts, voiceName, clipVoice],
    );

    return { languageCode: THAI_LANGUAGE_CODE, voiceName, clipVoice, speak };
}
