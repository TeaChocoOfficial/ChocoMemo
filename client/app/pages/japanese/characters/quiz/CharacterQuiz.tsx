// -Path: 'client/app/pages/japanese/characters/quiz/CharacterQuiz.tsx'
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import Badge from '~/components/custom/Badge';
import type { Choice } from '~/hooks/useQuizEngine';
import { buildChoices } from '~/hooks/useQuizEngine';
import type { Kana, KanaSetId } from '~/data/japanese/kana';
import { KANA_SETS, KANA_SET_IDS } from '~/data/japanese/kana';
import QuizProgress from '../../quiz/components/QuizProgress';
import QuizResult from '../../quiz/components/QuizResult';
import QuizQuestion from './components/QuizQuestion';
import QuizChoices, { type ChoiceFeedback } from './components/QuizChoices';

type Phase = 'intro' | 'playing' | 'result';

const QUESTIONS_PER_ROUND = 10;

type SetFilter = KanaSetId | 'both';

export default function CharacterQuizPage() {
    const { t } = useTranslation();
    const [phase, setPhase] = useState<Phase>('intro');
    const [setFilter, setSetFilter] = useState<SetFilter>('both');
    const [round, setRound] = useState<Kana[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<Record<string, ChoiceFeedback>>({});
    const [lastChoice, setLastChoice] = useState<Choice | null>(null);

    const getPool = (filter: SetFilter): Kana[] =>
        filter === 'both' ? [...KANA_SETS.hiragana, ...KANA_SETS.katakana] : KANA_SETS[filter];

    const startQuiz = (filter: SetFilter) => {
        const shuffled = [...getPool(filter)].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, QUESTIONS_PER_ROUND);
        setSetFilter(filter);
        setRound(selected);
        setQuestionIndex(0);
        setScore(0);
        setFeedback({});
        setLastChoice(null);
        setPhase('playing');
    };

    const retry = () => startQuiz(setFilter);

    const question = round[questionIndex];
    const allRomaji = useMemo(
        () => getPool(setFilter).map((k) => k.romaji),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setFilter],
    );

    const choices = useMemo<Choice[]>(() => {
        if (!question) return [];
        return buildChoices({
            correctLabel: question.romaji,
            allLabels: allRomaji,
            count: 3,
        });
    }, [question, allRomaji]);

    const handleSelect = (choice: Choice) => {
        if (lastChoice) return;
        setLastChoice(choice);
        const isCorrect = choice.isCorrect;
        if (isCorrect) setScore((s) => s + 1);

        setFeedback(() => {
            const map: Record<string, ChoiceFeedback> = {};
            for (const c of choices) {
                map[c.id] = c.isCorrect ? 'correct' : c.id === choice.id ? 'wrong' : 'idle';
            }
            return map;
        });
    };

    const next = () => {
        if (questionIndex + 1 >= round.length) {
            setPhase('result');
            return;
        }
        setQuestionIndex((i) => i + 1);
        setFeedback({});
        setLastChoice(null);
    };

    const setTabs: { id: SetFilter; label: string }[] = [
        { id: 'both', label: t('japanese.characterQuiz.sets.both') },
        { id: 'hiragana', label: t('japanese.characterQuiz.sets.hiragana') },
        { id: 'katakana', label: t('japanese.characterQuiz.sets.katakana') },
    ];

    const promptLabel = t('japanese.characterQuiz.promptLabel');

    return (
        <section className='relative min-h-screen overflow-hidden py-16 sm:py-20'>
            <div className='absolute inset-0 -z-10'>
                <div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2' />
                <div className='absolute bottom-0 left-0 w-80 h-80 bg-secondary/8 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3' />
            </div>

            <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese/characters'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.characterQuiz.back_characters')}
                </Link>

                {phase === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='text-center'
                    >
                        <Badge variant='info' className='mb-6'>
                            {t('japanese.characterQuiz.badge')}
                        </Badge>
                        <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                            {t('japanese.characterQuiz.title')}
                        </h1>
                        <p className='max-w-xl mx-auto text-lg text-surface-subtle leading-relaxed mb-10'>
                            {t('japanese.characterQuiz.intro')}
                        </p>

                        <div className='inline-flex flex-col items-center gap-3'>
                            <span className='text-sm font-medium text-surface-muted'>
                                {t('japanese.characterQuiz.chooseSet')}
                            </span>
                            <div className='flex flex-wrap justify-center gap-2 p-1 rounded-xl bg-surface-overlay border border-border'>
                                {setTabs.map((set) => (
                                    <button
                                        key={set.id}
                                        type='button'
                                        onClick={() => setSetFilter(set.id)}
                                        className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                                            setFilter === set.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-surface-muted hover:text-surface-foreground'
                                        }`}
                                    >
                                        {set.label}
                                    </button>
                                ))}
                            </div>
                            <button
                                type='button'
                                onClick={() => startQuiz(setFilter)}
                                className='mt-4 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all duration-300 cursor-pointer active:scale-95'
                            >
                                {t('japanese.characterQuiz.start')}
                            </button>
                        </div>
                    </motion.div>
                )}

                {phase === 'playing' && question && (
                    <div>
                        <div className='mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
                            <QuizProgress
                                current={questionIndex + 1}
                                total={round.length}
                                label={t('japanese.characterQuiz.progress')}
                            />
                            <span className='text-sm font-bold text-success shrink-0'>
                                {t('japanese.characterQuiz.score')}: {score}
                            </span>
                        </div>

                        <QuizQuestion
                            current={questionIndex}
                            prompt={question.char}
                            promptLabel={promptLabel}
                        />

                        <QuizChoices
                            choices={choices}
                            feedback={feedback}
                            disabled={!!lastChoice}
                            onSelect={handleSelect}
                        />

                        {lastChoice && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='mt-8 text-center'
                            >
                                <p
                                    className={`mb-4 text-lg font-bold ${
                                        lastChoice.isCorrect ? 'text-success' : 'text-error'
                                    }`}
                                >
                                    {lastChoice.isCorrect
                                        ? t('japanese.characterQuiz.correct')
                                        : `${t('japanese.characterQuiz.wrong')} ${t('japanese.characterQuiz.correctAnswer')}: ${question.romaji}`}
                                </p>
                                <button
                                    type='button'
                                    onClick={next}
                                    className='px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all duration-300 cursor-pointer active:scale-95'
                                >
                                    {t('japanese.characterQuiz.next')}
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}

                {phase === 'result' && (
                    <QuizResult
                        score={score}
                        total={round.length}
                        title={t('japanese.characterQuiz.resultTitle')}
                        retryLabel={t('japanese.characterQuiz.retry')}
                        onRetry={retry}
                    />
                )}
            </div>
        </section>
    );
}
