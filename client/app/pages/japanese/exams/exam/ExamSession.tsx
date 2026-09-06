// -Path: 'client/app/pages/japanese/vocabulary/exam/ExamSession.tsx'
import { useParams } from 'react-router';
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import Button from '~/components/custom/Button';
import Section from '~/components/custom/Section';
import ExamOption from './ExamOption';
import { useExamSession } from '~/hooks/useExamSession';
import { useLangText } from '~/hooks/useLangText';
import { defaultExamSets } from '~/data/japanese/defaultExamSets';
import { useAllExamSets } from '~/stores/examSets.store';
import type { ExamSet } from '~/types/exam';

export default function ExamSession() {
    const { examId } = useParams<{ examId: string }>();
    const allSets = useAllExamSets(defaultExamSets);
    const examSet = examId ? allSets.find((s) => s.id === examId) : undefined;

    if (!examSet) {
        return (
            <Section>
                <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full py-20 text-center'>
                    <p className='text-sm text-surface-muted'>
                        Exam set not found.{' '}
                        <Link to='/japanese/exams' className='font-semibold text-accent'>
                            Back to sets
                        </Link>
                    </p>
                </div>
            </Section>
        );
    }

    return (
        <Section>
            <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full py-10'>
                <Link
                    to='/japanese/exams'
                    className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition-colors hover:text-accent'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    Back to sets
                </Link>
                <ExamSessionInner examSet={examSet} />
            </div>
        </Section>
    );
}

function ExamSessionInner({ examSet }: { examSet: ExamSet }) {
    const meaning = useLangText();
    const { currentQuestion, index, total, selected, answered, score, isComplete, selectAnswer, next } =
        useExamSession(examSet);

    if (isComplete) {
        return (
            <div className='flex flex-col items-center gap-4 py-16 text-center'>
                <p className='text-5xl font-black tracking-tighter text-surface-foreground'>
                    {score} <span className='text-surface-muted'>/ {total}</span>
                </p>
                <p className='text-sm text-surface-muted'>Exam complete!</p>
                <div className='mt-2 flex gap-3'>
                    <Link to='/japanese/exams'>
                        <Button variant='secondary'>Back to sets</Button>
                    </Link>
                    <Button variant='primary' onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className='mx-auto max-w-lg'>
            <p className='mb-6 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-surface-muted tabular-nums'>
                Question {index + 1} / {total}
            </p>

            <div className='mb-8 rounded-sm border border-line bg-surface px-8 py-10 text-center'>
                {currentQuestion.promptReading && (
                    <p className='mb-2 font-mono text-sm text-surface-muted'>
                        {currentQuestion.promptReading}
                    </p>
                )}
                <h2 className='text-5xl font-black tracking-tighter text-surface-foreground'>
                    {currentQuestion.prompt}
                </h2>
            </div>

            <div className='flex flex-col gap-3'>
                {currentQuestion.options.map((option, i) => (
                    <ExamOption
                        key={i}
                        index={i}
                        text={meaning(option)}
                        isSelected={selected === option}
                        isCorrect={option === currentQuestion.correctAnswer}
                        answered={answered}
                        onClick={() => selectAnswer(option)}
                    />
                ))}
            </div>

            {answered && (
                <div className='mt-6 flex justify-end'>
                    <Button variant='primary' onClick={next}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}