// -Path: 'client/app/pages/japanese/characters/quiz/hooks/useCharacterQuiz.ts'
// Game engine for the character quiz: pool building, round selection, per-question
// timer, scoring, feedback, and answer history. Owns the phase machine
// (intro -> playing -> result) with mode-aware choice building and no rendering.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Choice } from '~/hooks/useQuizEngine';
import { buildChoices, uniqueStrings } from '~/hooks/useQuizEngine';
import type { Kana, KanaChars, KanaSetId } from '~/data/japanese/kana';
import { KANA_CHARS } from '~/data/japanese/kana';
import type { QuizSettingsState } from '../components/setting/QuizSettings';
import type { ChoiceFeedback } from '../components/game/QuizChoices';

export type GroupId = keyof KanaChars;

export type QuizMode = 'charToRomaji' | 'romajiToChar' | 'listenToChar';

export interface HistoryEntry {
    char: string;
    romaji: string;
    correct: boolean;
    timedOut: boolean;
    userAnswer: string | null;
}

export type QuizPhase = 'intro' | 'playing' | 'result';

export const DEFAULT_SETTINGS: QuizSettingsState = {
    hiragana: { voiceless: true, voiced: true, contracted: true },
    katakana: { voiceless: false, voiced: false, contracted: false },
    questionCount: 10,
    choiceCount: 4,
    timeLimit: 10,
    autoAdvance: false,
    useAll: false,
    mode: 'charToRomaji',
};

const getPool = (s: QuizSettingsState): Kana[] => {
    const pool: Kana[] = [];
    (['hiragana', 'katakana'] as KanaSetId[]).forEach((set) => {
        (['voiceless', 'voiced', 'contracted'] as GroupId[]).forEach((group) => {
            if (s[set][group]) pool.push(...KANA_CHARS[set][group]);
        });
    });
    return pool.filter((k) => k.char && k.romaji);
};

const allRomajiLabels = (): string[] =>
    Array.from(
        new Set(
            Object.values(KANA_CHARS)
                .flatMap((chars) => Object.values(chars).flat())
                .map((k) => k.romaji)
                .filter(Boolean),
        ),
    );

const allCharLabels = (): string[] =>
    Array.from(
        new Set(
            Object.values(KANA_CHARS)
                .flatMap((chars) => Object.values(chars).flat())
                .map((k) => k.char)
                .filter(Boolean),
        ),
    );

/** The answer the user must supply for a given mode (the choice pool labels). */
export const modeAnswerKind = (mode: QuizMode): 'char' | 'romaji' =>
    mode === 'romajiToChar' || mode === 'listenToChar' ? 'char' : 'romaji';

export function useCharacterQuiz(settings: QuizSettingsState) {
    const [phase, setPhase] = useState<QuizPhase>('intro');
    const [round, setRound] = useState<Kana[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [timeoutCount, setTimeoutCount] = useState(0);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [feedback, setFeedback] = useState<Record<string, ChoiceFeedback>>({});
    const [lastChoice, setLastChoice] = useState<Choice | null>(null);
    const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
    const [timedOut, setTimedOut] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const question = round[questionIndex];

    const addHistory = (entry: HistoryEntry) => {
        setHistory((prev) => [...prev, entry]);
    };

    const startQuiz = () => {
        const pool = getPool(settings);
        const effective = pool.length ? pool : getPool(DEFAULT_SETTINGS);
        const shuffled = [...effective].sort(() => Math.random() - 0.5);
        const selected = settings.useAll
            ? shuffled
            : shuffled.slice(0, Math.min(settings.questionCount, shuffled.length));
        setRound(selected);
        setQuestionIndex(0);
        setScore(0);
        setWrongCount(0);
        setTimeoutCount(0);
        setHistory([]);
        setFeedback({});
        setLastChoice(null);
        setTimedOut(false);
        setTimeLeft(settings.timeLimit);
        setPhase('playing');
    };

    const goToSettings = () => {
        setPhase('intro');
    };

    const advance = () => {
        if (questionIndex + 1 >= round.length) {
            setPhase('result');
            return;
        }
        setQuestionIndex((i) => i + 1);
        setFeedback({});
        setLastChoice(null);
        setTimedOut(false);
        setTimeLeft(settings.timeLimit);
    };

    const endGame = () => {
        setPhase('result');
        setFeedback({});
        setLastChoice(null);
        setTimedOut(false);
    };

    // Countdown timer per question
    useEffect(() => {
        if (phase !== 'playing' || !question || lastChoice) return;

        setTimeLeft(settings.timeLimit);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [phase, question, lastChoice, settings.timeLimit]);

    // Timeout -> mark as wrong and advance
    useEffect(() => {
        if (phase === 'playing' && question && timeLeft === 0 && !lastChoice) {
            setTimedOut(true);
            setFeedback({});
            setTimeoutCount((c) => c + 1);
            addHistory({ char: question.char, romaji: question.romaji, correct: false, timedOut: true, userAnswer: null });
            const id = setTimeout(() => {
                advance();
                setTimedOut(false);
            }, 700);
            return () => clearTimeout(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, phase, question, lastChoice]);

    // Auto-advance: when enabled, advance shortly after the user picks an answer
    useEffect(() => {
        if (phase === 'playing' && question && lastChoice && settings.autoAdvance) {
            const id = setTimeout(() => {
                advance();
            }, 900);
            return () => clearTimeout(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, question, lastChoice, settings.autoAdvance]);

    const answerKind = modeAnswerKind(settings.mode);

    const choices = useMemo<Choice[]>(() => {
        if (!question) return [];
        const correctLabel = answerKind === 'char' ? question.char : question.romaji;
        const allLabels = answerKind === 'char' ? allCharLabels() : allRomajiLabels();
        // buildChoices' `count` is the number of WRONG distractors, so total
        // choices = count + 1. Distractors are capped at the pool available.
        const distractorBudget = Math.min(
            Math.max(settings.choiceCount - 1, 0),
            Math.max(uniqueStrings(
                allLabels.filter((label) => label !== correctLabel),
            ).length, 0),
        );
        return buildChoices({ correctLabel, allLabels, count: distractorBudget });
    }, [question, answerKind, settings.choiceCount]);

    const handleSelect = (choice: Choice) => {
        if (lastChoice) return;
        setLastChoice(choice);
        const isCorrect = choice.isCorrect;
        if (isCorrect) {
            setScore((s) => s + 1);
        } else {
            setWrongCount((c) => c + 1);
        }
        addHistory({
            char: question.char,
            romaji: question.romaji,
            correct: isCorrect,
            timedOut: false,
            userAnswer: choice.label,
        });

        setFeedback(() => {
            const map: Record<string, ChoiceFeedback> = {};
            for (const c of choices) {
                map[c.id] = c.isCorrect ? 'correct' : c.id === choice.id ? 'wrong' : 'idle';
            }
            return map;
        });
    };

    return {
        phase,
        round,
        question,
        questionIndex,
        score,
        wrongCount,
        timeoutCount,
        history,
        feedback,
        lastChoice,
        timeLeft,
        timedOut,
        choices,
        answerKind,
        startQuiz,
        goToSettings,
        advance,
        endGame,
        handleSelect,
    };
}