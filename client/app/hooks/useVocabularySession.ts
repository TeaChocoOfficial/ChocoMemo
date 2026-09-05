// -Path: 'client/app/hooks/useVocabularySession.ts'
import { useState, useMemo, useCallback, useRef } from 'react';
import { useVocabProgressStore } from '~/stores/vocabProgress.store';
import type { VocabWord } from '~/types/vocabulary';

// Failed words reappear soon; passed words reappear farther back in the
// queue so the user still meets them again before the SRS due date.
const REQUEUE_MIN = 3;
const REQUEUE_MAX = 6;
const REQUEUE_FAR_MIN = 8;
const REQUEUE_FAR_MAX = 12;

// A word graduates out of the session after this many appearances, so the
// session still terminates while every word gets a spaced second chance.
const MAX_SESSION_APPEARANCES = 2;

const randBetween = (min: number, max: number) =>
    min + Math.floor(Math.random() * (max - min + 1));

export function useVocabularySession(words: VocabWord[]) {
    const { getProgress, recordPass, recordFail } = useVocabProgressStore();

    const [queue, setQueue] = useState<string[]>(() => {
        const now = Date.now();
        const due = words.filter((w) => getProgress(w.id).dueAt <= now).map((w) => w.id);
        return [...due].sort(() => Math.random() - 0.5);
    });
    const appearancesRef = useRef<Record<string, number>>({});
    const [revealed, setRevealed] = useState(false);

    const currentWord = useMemo(() => words.find((w) => w.id === queue[0]) ?? null, [words, queue]);

    const reveal = useCallback(() => setRevealed(true), []);

    const answer = useCallback(
        (pass: boolean) => {
            if (!currentWord) return;

            const id = currentWord.id;
            if (pass) recordPass(id);
            else recordFail(id);

            const appearances = (appearancesRef.current[id] ?? 0) + 1;
            appearancesRef.current[id] = appearances;

            setQueue((prev) => {
                const rest = prev.slice(1);
                if (pass && appearances >= MAX_SESSION_APPEARANCES) return rest;

                const insertAt = Math.min(
                    rest.length,
                    pass
                        ? randBetween(REQUEUE_FAR_MIN, REQUEUE_FAR_MAX)
                        : randBetween(REQUEUE_MIN, REQUEUE_MAX),
                );
                const next = [...rest];
                next.splice(insertAt, 0, id);
                return next;
            });
            setRevealed(false);
        },
        [currentWord, recordPass, recordFail],
    );

    return {
        currentWord,
        revealed,
        reveal,
        answer,
        remaining: queue.length,
        isSessionComplete: queue.length === 0,
    };
}