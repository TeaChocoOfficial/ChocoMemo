// -Path: 'client/app/hooks/characters/useAlphabetReader.ts'
// Owns the alphabet "reading console" state: speaking one letter at a time
// with the browser's Web Speech API, tracking progress per set:group, and
// exposing the derived display values the toolbar and grid need. The English
// twin of `useKanaReader`.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getVoiceForSpeech } from '~/hooks/base/useSpeak';
import { useSpeechStore } from '~/stores/config/speech.store';
import { useAlphabetProgressStore } from '~/stores/en/alphabetProgress.store';
import { isVowel, type AlphabetSetId } from '~/data/en/alphabet';
import type { ReadableChar } from '~/types/characters';

/** The chart's two reading groups, derived from the flat A–Z list. */
export type LetterGroupId = 'vowels' | 'consonants';

/**
 * Reading state for one set:group of the English alphabet — the walk, the
 * resume point, and the derived display values for the toolbar and grid. The
 * data stays flat A–Z; the group is filtered here via `isVowel`.
 *
 * @param activeSet - Upper- or lowercase set currently shown.
 * @param activeGroup - The group being read (`vowels` / `consonants`).
 * @param letters - The full flat alphabet of the active set, in A–Z order.
 * @returns Reading state and controls for the console.
 */
export function useAlphabetReader(
    activeSet: AlphabetSetId,
    activeGroup: LetterGroupId,
    letters: ReadableChar[],
) {
    const { t } = useTranslation();
    const [isReading, setIsReading] = useState(false);
    const [readingChar, setReadingChar] = useState<string | null>(null);
    const readingRef = useRef(false);

    const { voiceURI, lang, rate, volume } = useSpeechStore();
    const { progress, recordRead } = useAlphabetProgressStore();

    const key = `${activeSet}:${activeGroup}`;

    const groupLetters = useMemo(
        () =>
            activeGroup === 'vowels'
                ? letters.filter(isVowel)
                : letters.filter((letter) => !isVowel(letter)),
        [letters, activeGroup],
    );
    const groupList = groupLetters.filter((letter) => letter.char);
    const groupTotal = groupList.length;

    const lastReadIndex = progress[key] ?? 0;
    const displayChar = readingChar ?? groupLetters[lastReadIndex]?.char ?? null;
    const readSoFar = displayChar
        ? groupList.findIndex((letter) => letter.char === displayChar) + 1
        : 0;
    const isResume = readSoFar > 0;
    const percentRead = groupTotal ? Math.round((readSoFar / groupTotal) * 100) : 0;
    const currentName = isResume ? (groupList[readSoFar - 1]?.read ?? '') : '';
    const statusLabel = isReading
        ? t('english.character.nowReading')
        : isResume
          ? t('english.character.upNext')
          : t('english.character.readStart');

    const stopReading = useCallback(() => {
        readingRef.current = false;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsReading(false);
        setReadingChar(null);
    }, []);

    const startReading = useCallback(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

        const list = groupLetters;
        if (list.length === 0) return;

        let index = progress[key] ?? 0;
        if (index >= list.length) index = 0;

        window.speechSynthesis.cancel();
        readingRef.current = true;
        setIsReading(true);

        const step = (position: number) => {
            if (!readingRef.current) return;
            const letter = list[position];

            if (!letter) {
                recordRead(key, 0);
                readingRef.current = false;
                setIsReading(false);
                setReadingChar(null);
                return;
            }

            if (!letter.char) {
                step(position + 1);
                return;
            }

            setReadingChar(letter.char);

            const utterance = new SpeechSynthesisUtterance(letter.char);
            utterance.lang = lang;
            utterance.rate = rate;
            utterance.volume = volume;
            utterance.pitch = 1;

            const voice = getVoiceForSpeech(voiceURI, lang);
            if (voice) utterance.voice = voice;

            utterance.onstart = () => {
                if (!readingRef.current) return;
                recordRead(key, position);
            };
            utterance.onend = () => {
                if (!readingRef.current) return;
                step(position + 1);
            };
            utterance.onerror = () => {
                readingRef.current = false;
                setIsReading(false);
                setReadingChar(null);
            };

            window.speechSynthesis.speak(utterance);
        };

        step(index);
    }, [groupLetters, key, lang, progress, rate, recordRead, voiceURI, volume]);

    const handleCardRead = useCallback(
        (letter: ReadableChar, index: number) => {
            recordRead(key, index);
            setReadingChar(letter.char);
            if (readingRef.current) stopReading();
        },
        [key, recordRead, stopReading],
    );

    useEffect(() => {
        return stopReading;
    }, [stopReading]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code !== 'Space') return;
            const tag = (event.target as HTMLElement | null)?.tagName;
            if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')
                return;
            event.preventDefault();
            if (isReading) stopReading();
            else startReading();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isReading, startReading, stopReading]);

    return {
        isReading,
        readingChar,
        displayChar,
        readSoFar,
        groupTotal,
        isResume,
        percentRead,
        currentName,
        statusLabel,
        groupList,
        startReading,
        stopReading,
        handleCardRead,
    };
}
