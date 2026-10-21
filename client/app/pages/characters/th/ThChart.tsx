// -Path: 'client/app/pages/characters/th/ThChart.tsx'
import { useCallback, useMemo } from 'react';
import ThaiGrid from './components/ThaiGrid';
import CharactersPage from '../components/CharactersPage';
import { useCharacterReader } from '~/hooks/characters/useCharacterReader';
import { useThaiVoice } from '~/hooks/characters/useThaiVoice';
import { thaiClipUrl } from '~/utils/characters/thaiClip';
import type { ReadableChar } from '~/types/characters';

/**
 * The Thai character chart: the twin of the English alphabet page — hero,
 * stats, a sticky toolbar with the reading console, then the Thai grid for
 * the active set (consonants, vowels, tones). Speech uses Google Cloud TTS
 * (via the server proxy) with the learner's chosen Thai voice, and falls back
 * to the pre-rendered Thai clips when the server has no Google key.
 *
 * @returns The rendered Thai chart page.
 */
export default function ThChartPage() {
    const lang = 'th';
    const { languageCode, voiceName, clipVoice } = useThaiVoice();

    /** The Thai chart reads the letter NAME ("ko kai"), not the bare glyph. */
    const getSpeechText = useCallback((item: ReadableChar) => item.read, []);

    /** The clip speaks the character itself, so it is used only when Google TTS has no voice. */
    const getAudioSrc = useCallback(
        (item: ReadableChar) => (voiceName ? undefined : thaiClipUrl(item.sound, clipVoice)),
        [voiceName, clipVoice],
    );

    const tts = useMemo(
        () => (voiceName ? { languageCode, voiceName } : undefined),
        [languageCode, voiceName],
    );

    const characterReader = useCharacterReader({
        targetLang: lang,
        tts,
        getSpeechText,
        getAudioSrc,
    });
    const { readingChar, handleCardRead } = characterReader;

    return (
        <CharactersPage lang={lang} characterReader={characterReader}>
            <ThaiGrid activeChar={readingChar} onRead={handleCardRead} />
        </CharactersPage>
    );
}
