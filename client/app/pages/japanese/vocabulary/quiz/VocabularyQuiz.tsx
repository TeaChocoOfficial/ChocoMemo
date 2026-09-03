// -Path: 'client/app/pages/japanese/vocabulary/quiz/VocabularyQuiz.tsx'
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { FaArrowLeft, FaPlus, FaTrash, FaGear } from 'react-icons/fa6';
import Badge from '~/components/custom/Badge';
import type { Choice } from '~/hooks/useQuizEngine';
import { buildChoices } from '~/hooks/useQuizEngine';
import type { VocabularyWord } from '~/data/japanese/vocabulary';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { useVocabularyStore } from '~/stores/vocabulary.store';
import QuizProgress from '../../quiz/components/QuizProgress';
import VocabQuestion from './components/VocabQuestion';
import VocabChoices, { type VocabChoiceFeedback } from './components/VocabChoices';
import VocabResult from './components/VocabResult';

type Phase = 'intro' | 'playing' | 'result';

const QUESTIONS_PER_ROUND = 10;

export default function VocabularyQuizPage() {
    const { t } = useTranslation();
    const { custom, addCustom, removeCustom } = useVocabularyStore();

    const [phase, setPhase] = useState<Phase>('intro');
    const [showManage, setShowManage] = useState(false);
    const [round, setRound] = useState<VocabularyWord[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<Record<string, VocabChoiceFeedback>>({});
    const [lastChoice, setLastChoice] = useState<Choice | null>(null);

    const [jpValue, setJpValue] = useState('');
    const [readingValue, setReadingValue] = useState('');
    const [meaningValue, setMeaningValue] = useState('');

    const allWords = useMemo(() => [...DEFAULT_VOCABULARY, ...custom], [custom]);

    const startQuiz = () => {
        const pool = allWords.length > 0 ? allWords : DEFAULT_VOCABULARY;
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, QUESTIONS_PER_ROUND);
        setRound(selected);
        setQuestionIndex(0);
        setScore(0);
        setFeedback({});
        setLastChoice(null);
        setPhase('playing');
    };

    const retry = () => startQuiz();
    const question = round[questionIndex];

    const choices = useMemo<Choice[]>(() => {
        if (!question) return [];
        return buildChoices({
            correctLabel: question.meaning,
            allLabels: allWords.map((w) => w.meaning),
            count: 3,
        });
    }, [question, allWords]);

    const handleSubmitWord = () => {
        if (!jpValue.trim() || !meaningValue.trim()) return;
        addCustom({
            japanese: jpValue.trim(),
            reading: readingValue.trim(),
            meaning: meaningValue.trim(),
        });
        setJpValue('');
        setReadingValue('');
        setMeaningValue('');
    };

    const handleSelect = (choice: Choice) => {
        if (lastChoice) return;
        setLastChoice(choice);
        if (choice.isCorrect) setScore((s) => s + 1);

        setFeedback(() => {
            const map: Record<string, VocabChoiceFeedback> = {};
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

    return (
        <section className='relative min-h-screen overflow-hidden py-16 sm:py-20'>
            <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.vocabularyQuiz.back_hub')}
                </Link>

                {phase === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className='text-center'
                    >
                        <Badge variant='info' className='mb-6'>
                            {t('japanese.vocabularyQuiz.badge')}
                        </Badge>
                        <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                            {t('japanese.vocabularyQuiz.title')}
                        </h1>
                        <p className='max-w-xl mx-auto text-lg text-surface-subtle leading-relaxed mb-8'>
                            {t('japanese.vocabularyQuiz.intro')}
                        </p>

                        <p className='mb-6 text-sm text-surface-muted'>
                            {t('japanese.vocabularyQuiz.available', {
                                count: allWords.length,
                            })}
                        </p>

                        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-10'>
                            <button
                                type='button'
                                onClick={startQuiz}
                                className='px-8 py-3.5 rounded-sm bg-accent text-accent-foreground text-base font-semibold transition-colors duration-200 cursor-pointer hover:bg-accent-emphasis active:translate-y-px'
                            >
                                {t('japanese.vocabularyQuiz.start')}
                            </button>
                            <button
                                type='button'
                                onClick={() => setShowManage((v) => !v)}
                                className='inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-line-strong text-surface-foreground hover:border-accent hover:text-accent text-base font-semibold transition-colors duration-200 cursor-pointer'
                            >
                                <FaGear className='w-4 h-4' />
                                {t('japanese.vocabularyQuiz.manage')}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showManage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className='overflow-hidden'
                                >
                                    <div className='text-left rounded-sm border border-line bg-surface p-6'>
                                        <h3 className='text-lg font-bold tracking-tight text-surface-foreground mb-4'>
                                            {t('japanese.vocabularyQuiz.manageTitle')}
                                        </h3>

                                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4'>
                                            <input
                                                value={jpValue}
                                                onChange={(e) => setJpValue(e.target.value)}
                                                placeholder={t(
                                                    'japanese.vocabularyQuiz.jpPlaceholder',
                                                )}
                                                className='px-4 py-2.5 rounded-sm border border-line bg-surface-overlay text-surface-foreground focus:outline-accent transition-colors'
                                            />
                                            <input
                                                value={readingValue}
                                                onChange={(e) => setReadingValue(e.target.value)}
                                                placeholder={t(
                                                    'japanese.vocabularyQuiz.readingPlaceholder',
                                                )}
                                                className='px-4 py-2.5 rounded-sm border border-line bg-surface-overlay text-surface-foreground focus:outline-accent transition-colors'
                                            />
                                            <input
                                                value={meaningValue}
                                                onChange={(e) => setMeaningValue(e.target.value)}
                                                placeholder={t(
                                                    'japanese.vocabularyQuiz.meaningPlaceholder',
                                                )}
                                                className='px-4 py-2.5 rounded-sm border border-line bg-surface-overlay text-surface-foreground focus:outline-accent transition-colors'
                                            />
                                        </div>
                                        <button
                                            type='button'
                                            onClick={handleSubmitWord}
                                            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-accent text-accent-foreground text-sm font-semibold transition-colors duration-200 cursor-pointer hover:bg-accent-emphasis active:translate-y-px'
                                        >
                                            <FaPlus className='w-3.5 h-3.5' />
                                            {t('japanese.vocabularyQuiz.add')}
                                        </button>

                                        {custom.length > 0 && (
                                            <div className='mt-6'>
                                                <p className='text-sm font-semibold text-surface-muted mb-3'>
                                                    {t('japanese.vocabularyQuiz.customList')}
                                                </p>
                                                <ul className='space-y-2'>
                                                    {custom.map((word) => (
                                                        <li
                                                            key={word.id}
                                                            className='flex items-center justify-between gap-3 rounded-sm border border-line bg-surface-overlay px-4 py-2.5'
                                                        >
                                                            <div>
                                                                <span className='font-bold text-surface-foreground'>
                                                                    {word.japanese}
                                                                </span>
                                                                <span className='text-sm text-surface-muted ml-2'>
                                                                    {word.reading} · {word.meaning}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type='button'
                                                                onClick={() =>
                                                                    removeCustom(word.id)
                                                                }
                                                                className='text-surface-muted hover:text-error transition-colors cursor-pointer'
                                                                aria-label={t(
                                                                    'japanese.vocabularyQuiz.remove',
                                                                )}
                                                            >
                                                                <FaTrash className='w-4 h-4' />
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {phase === 'playing' && question && (
                    <div>
                        <div className='mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
                            <QuizProgress
                                current={questionIndex + 1}
                                total={round.length}
                                label={t('japanese.vocabularyQuiz.progress')}
                            />
                            <span className='text-sm font-bold text-success shrink-0'>
                                {t('japanese.vocabularyQuiz.score')}: {score}
                            </span>
                        </div>

                        <VocabQuestion
                            current={questionIndex}
                            prompt={question.japanese}
                            promptHint={question.reading || undefined}
                            promptLabel={t('japanese.vocabularyQuiz.promptLabel')}
                        />

                        <VocabChoices
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
                                        ? t('japanese.vocabularyQuiz.correct')
                                        : `${t('japanese.vocabularyQuiz.wrong')} ${t('japanese.vocabularyQuiz.correctAnswer')}: ${question.meaning}`}
                                </p>
                                <button
                                    type='button'
                                    onClick={next}
                                    className='px-8 py-3.5 rounded-sm bg-accent text-accent-foreground text-base font-semibold transition-colors duration-200 cursor-pointer hover:bg-accent-emphasis active:translate-y-px'
                                >
                                    {t('japanese.vocabularyQuiz.next')}
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}

                {phase === 'result' && (
                    <VocabResult
                        score={score}
                        total={round.length}
                        title={t('japanese.vocabularyQuiz.resultTitle')}
                        retryLabel={t('japanese.vocabularyQuiz.retry')}
                        onRetry={retry}
                    />
                )}
            </div>
        </section>
    );
}
