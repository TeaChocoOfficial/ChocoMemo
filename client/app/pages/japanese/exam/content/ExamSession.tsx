// -Path: 'client/app/pages/japanese/vocabulary/exam/ExamSession.tsx'
import { useParams } from 'react-router';
import { Languages } from '~/data/language';
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import Button from '~/components/custom/Button';
import Section from '~/components/custom/Section';
import ExamOption from './ExamOption';
import { useExamSession } from '~/hooks/useExamSession';
import { useLangText } from '~/hooks/useLangText';
import { deckQuestions, localDecksOfType } from '~/stores/deck/deckListLocal.store';
import { allDecksFor } from '~/data/japanese/deckDefaults';
import type { ExamQuestion } from '~/types/exam';
import type { LangText } from '~/types/type';

export default function ExamSession() {
    const { examId } = useParams<{ examId: string }>();
    const allSets = allDecksFor(Languages.ja, localDecksOfType(Languages.ja, 'exam')).filter(
        // A deck whose questions were deleted resolves to none, so drop it
        // here and let the not-found branch below handle it.
        (deck) => deck.type === 'exam' && deckQuestions(deck).length > 0,
    );
    const examSet = examId ? allSets.find((s) => s.id === examId) : undefined;

    if (!examSet) {
        return (
            <Section>
                <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full py-20 text-center'>
                    <p className='text-sm text-surface-muted'>
                        Exam set not found.{' '}
                        <Link to='/japanese/exam' className='font-semibold text-primary'>
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
                    to='/japanese/exam'
                    className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition-colors hover:text-primary'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    Back to sets
                </Link>
                <ExamSessionInner examSet={{ questions: deckQuestions(examSet) }} />
            </div>
        </Section>
    );
}

function ExamSessionInner({ examSet }: { examSet: { questions: ExamQuestion[] } }) {
    const meaning = useLangText();
    const {
        currentQuestion,
        index,
        total,
        selected,
        answered,
        score,
        isComplete,
        selectAnswer,
        next,
    } = useExamSession(examSet);

    if (isComplete) {
        return (
            <div className='flex flex-col items-center gap-4 py-16 text-center'>
                <p className='text-5xl font-black tracking-tighter text-surface-foreground'>
                    {score} <span className='text-surface-muted'>/ {total}</span>
                </p>
                <p className='text-sm text-surface-muted'>Exam complete!</p>
                <div className='mt-2 flex gap-3'>
                    <Link to='/japanese/exam'>
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

            <QuestionPrompt question={currentQuestion} selected={selected} meaning={meaning} />

            <OptionsGrid
                options={currentQuestion.options}
                correctAnswer={currentQuestion.correctAnswer}
                selected={selected}
                answered={answered}
                meaning={meaning}
                onSelect={selectAnswer}
            />

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

/** Question stem — differs by type, but both branches read the same
 *  options/answer machinery below. */
function QuestionPrompt({
    question,
    selected,
    meaning,
}: {
    question: ExamQuestion;
    selected: LangText | null;
    meaning: (text: LangText) => string;
}) {
    if (question.type === 'meaning') {
        return (
            <div className='mb-8 rounded-sm border border-line bg-surface px-8 py-10 text-center'>
                {question.promptReading && (
                    <p className='mb-2 font-mono text-sm text-surface-muted'>
                        {question.promptReading}
                    </p>
                )}
                <h2 className='text-5xl font-black tracking-tighter text-surface-foreground'>
                    {question.prompt}
                </h2>
            </div>
        );
    }

    return (
        <div className='mb-8 rounded-sm border border-line bg-surface px-8 py-10 text-center'>
            {question.sentenceReading && (
                <p className='mb-3 font-mono text-sm text-surface-muted'>
                    {question.sentenceReading}
                </p>
            )}
            <p className='text-xl font-medium leading-relaxed text-surface-foreground sm:text-2xl'>
                {question.sentenceBefore}
                <span
                    aria-label='blank'
                    className='mx-1.5 inline-flex min-w-[3.5rem] items-center justify-center rounded-sm border-b-2 border-primary bg-primary-subtle px-2 pb-0.5 align-baseline font-black text-surface-foreground'
                >
                    {selected ? meaning(selected) : '＿＿＿'}
                </span>
                {question.sentenceAfter}
            </p>
        </div>
    );
}

/** Options grid + answer selection — shared by every question type so the
 *  click-to-answer and correct/incorrect highlighting behavior is identical.
 *  4 or fewer options stack in one column; 5–8 switch to a 2-column grid. */
function OptionsGrid({
    options,
    correctAnswer,
    selected,
    answered,
    meaning,
    onSelect,
}: {
    options: LangText[];
    correctAnswer: LangText;
    selected: LangText | null;
    answered: boolean;
    meaning: (text: LangText) => string;
    onSelect: (answer: LangText) => void;
}) {
    const gridClass = options.length > 4 ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3';
    return (
        <div className={gridClass}>
            {options.map((option, i) => (
                <ExamOption
                    key={i}
                    index={i}
                    text={meaning(option)}
                    isSelected={selected === option}
                    isCorrect={option === correctAnswer}
                    answered={answered}
                    onClick={() => onSelect(option)}
                />
            ))}
        </div>
    );
}
