// -Path: 'client/app/hooks/useKanaReader.ts'
// Owns the kana "reading console" state: speaking one kana at a time with the
// browser's Web Speech API, tracking progress per set:group, and exposing the
// derived display values the toolbar and grid need. Extracted from KanaPage.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getVoiceForSpeech } from '~/hooks/useSpeak';
import { useSpeechStore } from '~/stores/speech.store';
import { useKanaProgressStore } from '~/stores/kanaProgress.store';
import type { Kana, KanaChars, KanaSetId } from '~/data/japanese/kana';

export function useKanaReader(
    activeSet: KanaSetId,
    activeGroup: keyof KanaChars,
    kanaChars: KanaChars,
) {
    const { t } = useTranslation();
    const [isReading, setIsReading] = useState(false);
    const [readingChar, setReadingChar] = useState<string | null>(null);
    const readingRef = useRef(false);

    const { voiceURI, lang, rate, volume } = useSpeechStore();
    const { progress, recordRead } = useKanaProgressStore();

    const key = `${activeSet}:${activeGroup}`;

    const groupList = kanaChars[activeGroup].filter((kana) => kana.char);
    const groupTotal = groupList.length;

    const lastReadIndex = progress[key] ?? 0;
    const displayChar = readingChar ?? kanaChars[activeGroup][lastReadIndex]?.char ?? null;
    const readSoFar = displayChar
        ? groupList.findIndex((kana) => kana.char === displayChar) + 1
        : 0;
    const isResume = readSoFar > 0;
    const percentRead = groupTotal ? Math.round((readSoFar / groupTotal) * 100) : 0;
    const currentRomaji = isResume ? (groupList[readSoFar - 1]?.romaji ?? '') : '';
    const statusLabel = isReading
        ? t('japanese.kana.nowReading')
        : isResume
          ? t('japanese.kana.upNext')
          : t('japanese.kana.readStart');

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

        const list = kanaChars[activeGroup];
        if (list.length === 0) return;

        let index = progress[key] ?? 0;
        if (index >= list.length) index = 0;

        window.speechSynthesis.cancel();
        readingRef.current = true;
        setIsReading(true);

        const step = (position: number) => {
            if (!readingRef.current) return;
            const kana = list[position];

            if (!kana) {
                recordRead(key, 0);
                readingRef.current = false;
                setIsReading(false);
                setReadingChar(null);
                return;
            }

            if (!kana.char) {
                step(position + 1);
                return;
            }

            setReadingChar(kana.char);

            const utterance = new SpeechSynthesisUtterance(kana.char);
            utterance.lang = lang;
            utterance.rate = rate;
            utterance.volume = volume;
            utterance.pitch = 1;

            const voice = getVoiceForSpeech(voiceURI);
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
    }, [activeGroup, key, kanaChars, lang, progress, rate, recordRead, voiceURI, volume]);

    const handleCardRead = useCallback(
        (kana: Kana, index: number) => {
            recordRead(key, index);
            setReadingChar(kana.char);
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
        currentRomaji,
        statusLabel,
        groupList,
        startReading,
        stopReading,
        handleCardRead,
    };
}
