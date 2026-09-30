// -Path: 'client/app/hooks/useExamSession.ts'
import type { ExamQuestion } from '~/types/deck/exam';
import type { LangText } from '~/types/type';
import { useState, useCallback } from 'react';

/** Drives one exam run. Takes just the questions, so it works for a whole
 *  `ExamSet` and for a `DeckData` of `type: 'exam'` alike. */
export function useExamSession(examSet: { questions: ExamQuestion[] }) {
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState<LangText | null>(null);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = examSet.questions[index] ?? null;
    const isComplete = index >= examSet.questions.length;

    const selectAnswer = useCallback(
        (answer: LangText) => {
            if (answered || !currentQuestion) return;
            setSelected(answer);
            setAnswered(true);
            if (answer === currentQuestion.correctAnswer) setScore((s) => s + 1);
        },
        [answered, currentQuestion],
    );

    const next = useCallback(() => {
        setSelected(null);
        setAnswered(false);
        setIndex((i) => i + 1);
    }, []);

    return {
        currentQuestion,
        index,
        total: examSet.questions.length,
        selected,
        answered,
        score,
        isComplete,
        selectAnswer,
        next,
    };
}
