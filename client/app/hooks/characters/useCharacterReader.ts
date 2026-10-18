// -Path: 'client/app/hooks/characters/useCharacterReader.ts'
// The reading console shared by every language's character chart: speak one
// character at a time with the Web Speech API, remember where the walk stopped,
// and expose the derived values the toolbar and grid display. Language hooks
// (`useKanaReader`, `useAlphabetReader`, ...) are thin wrappers that supply
// their own items, progress store and UI text.

import { useCharacterToolbar } from './useChacterToolbar';
import { getVoiceForSpeech } from '~/hooks/base/useSpeak';
import { useSpeechStore } from '~/stores/config/speech.store';
import { ALL_TARGETS, Languages } from '~/data/language';
import type { CharLang, OptionItem } from '~/types/characters';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReadProgressStore } from '~/stores/characters/readProgress.store';
import { targetFromCode, targetSpeechLang } from '~/utils/config/targetLang';

/** What the reading console is doing, for the caller to turn into text. */
export type ReaderStatus = 'reading' | 'resume' | 'idle';

export interface CharacterReaderOptions<Lang extends CharLang> {
    /** The group being read, in reading order. Entries with an empty `char` are layout gaps and are skipped. */
    targetLang: Lang;
    /** What to speak for an item. Defaults to its glyph. */
    getSpeechText?: (item: OptionItem<Lang>[number]) => string;
}

export type CharacterReader<Lang extends CharLang> = ReturnType<typeof useCharacterReader<Lang>>;

/**
 * Reading state and controls for one group of characters.
 *
 * The hook owns no UI text and no language knowledge: the caller decides what
 * `status` and `currentItem` look like on screen.
 *
 * @returns Reading state, derived display values, and start / stop / tap handlers.
 */
export function useCharacterReader<Lang extends CharLang>({
    targetLang,
    getSpeechText,
}: CharacterReaderOptions<Lang>) {
    const readingRef = useRef(false);
    const [isReading, setIsReading] = useState(false);
    const { progress, recordRead } = useReadProgressStore();
    const { voiceURI, rate, volume } = useSpeechStore();
    const [readingChar, setReadingChar] = useState<string | null>(null);
    const { items, activeSet, activeGroup } = useCharacterToolbar(targetLang);

    // The walk speaks in the chart's own language (en chart → en-US), not in
    // whatever language the global speech store last held — the voice pane is
    // not mounted on every page, so the store can still carry ja-JP here.
    const target = targetFromCode(targetLang);
    const speechLang = targetSpeechLang(
        target && target !== ALL_TARGETS ? target : Languages.en,
    );

    const progressKey = `${activeSet}:${activeGroup}`;
    const groupList = items.filter((item) => item.char);
    const groupTotal = groupList.length;

    const lastReadIndex = progress[progressKey] ?? 0;
    const displayChar = readingChar ?? items[lastReadIndex]?.char ?? null;
    const readSoFar = displayChar
        ? groupList.findIndex((item) => item.char === displayChar) + 1
        : 0;
    const isResume = readSoFar > 0;
    const percentRead = groupTotal ? Math.round((readSoFar / groupTotal) * 100) : 0;
    const currentItem: OptionItem<Lang>[number] | null = isResume
        ? (groupList[readSoFar - 1] ?? null)
        : null;
    const status: ReaderStatus = isReading ? 'reading' : isResume ? 'resume' : 'idle';

    const stopReading = useCallback(() => {
        readingRef.current = false;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window)
            window.speechSynthesis.cancel();

        setIsReading(false);
        setReadingChar(null);
    }, []);

    const startReading = useCallback(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        if (items.length === 0) return;

        let index = progress[progressKey] ?? 0;
        if (index >= items.length) index = 0;

        window.speechSynthesis.cancel();
        readingRef.current = true;
        setIsReading(true);

        const step = (position: number) => {
            if (!readingRef.current) return;
            const item = items[position];

            if (!item) {
                recordRead(progressKey, 0);
                readingRef.current = false;
                setIsReading(false);
                setReadingChar(null);
                return;
            }

            if (!item.char) return step(position + 1);

            setReadingChar(item.char);

            const utterance = new SpeechSynthesisUtterance(getSpeechText?.(item) ?? item.char);
            utterance.pitch = 1;
            utterance.lang = speechLang;
            utterance.rate = rate;
            utterance.volume = volume;

            const voice = getVoiceForSpeech(voiceURI, speechLang);
            if (voice) utterance.voice = voice;

            utterance.onstart = () => {
                if (!readingRef.current) return;
                recordRead(progressKey, position);
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
    }, [items, progressKey, progress, recordRead, getSpeechText, speechLang, rate, volume, voiceURI]);

    /** A tap on a card: remember it as the resume point and stop any running walk. */
    const handleCardRead = useCallback(
        (item: OptionItem<Lang>[number], index: number) => {
            recordRead(progressKey, index);
            setReadingChar(item.char);
            if (readingRef.current) stopReading();
        },
        [progressKey, recordRead, stopReading],
    );

    // Stop on unmount.
    useEffect(() => {
        return stopReading;
    }, [stopReading]);

    // A running walk holds the item list it started with, so changing the set or
    // group mid-walk would keep reading the old one under the new heading.
    useEffect(() => {
        if (readingRef.current) stopReading();
    }, [progressKey, stopReading]);

    // Space toggles reading, unless focus is on something that uses Space itself.
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
        currentItem,
        status,
        groupList,
        startReading,
        stopReading,
        handleCardRead,
    };
}
