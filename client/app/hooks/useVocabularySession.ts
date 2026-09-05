// -Path: 'client/app/hooks/useVocabularySession.ts'
import { useState, useMemo, useCallback } from 'react';
import { useVocabProgressStore } from '~/stores/vocabProgress.store';
import type { VocabWord } from '~/types/vocabulary';

const REQUEUE_MIN = 3;
const REQUEUE_MAX = 6;

export function useVocabularySession(words: VocabWord[]) {
    const { getProgress, recordPass, recordFail } = useVocabProgressStore();

    const [queue, setQueue] = useState<string[]>(() => {
        const now = Date.now();
        const due = words.filter((w) => getProgress(w.id).dueAt <= now).map((w) => w.id);
        return [...due].sort(() => Math.random() - 0.5);
    });
    const [revealed, setRevealed] = useState(false);

    const currentWord = useMemo(() => words.find((w) => w.id === queue[0]) ?? null, [words, queue]);

    const reveal = useCallback(() => setRevealed(true), []);

    const answer = useCallback(
        (pass: boolean) => {
            if (!currentWord) return;

            setQueue((prev) => {
                const rest = prev.slice(1);
                if (pass) {
                    recordPass(currentWord.id);
                    return rest;
                }
                recordFail(currentWord.id);
                const insertAt = Math.min(
                    rest.length,
                    REQUEUE_MIN + Math.floor(Math.random() * (REQUEUE_MAX - REQUEUE_MIN + 1)),
                );
                const next = [...rest];
                next.splice(insertAt, 0, currentWord.id);
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
