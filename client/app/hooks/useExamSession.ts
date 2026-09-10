// -Path: 'client/app/hooks/useExamSession.ts'
import type { ExamSet } from '~/types/exam';
import type { LangText } from '~/types/type';
import { useState, useCallback } from 'react';

export function useExamSession(examSet: ExamSet) {
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