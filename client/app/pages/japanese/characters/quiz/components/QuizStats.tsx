// -Path: 'client/app/pages/japanese/characters/quiz/components/QuizStats.tsx'
// Playing header for the character quiz: progress bar plus live
// Correct / Wrong / Timeout counters and an End Game button.
import { useTranslation } from 'react-i18next';
import { FaXmark, FaCheck, FaClock } from 'react-icons/fa6';
import QuizProgress from '../../../quiz/components/QuizProgress';

interface QuizStatsProps {
    current: number;
    total: number;
    score: number;
    wrongCount: number;
    timeoutCount: number;
    onEnd: () => void;
}

export default function QuizStats({
    current,
    total,
    score,
    wrongCount,
    timeoutCount,
    onEnd,
}: QuizStatsProps) {
    const { t } = useTranslation();

    return (
        <div className='mb-6 space-y-4 rounded-sm border border-line bg-surface-overlay p-4'>
            <div className='flex items-center justify-between gap-4'>
                <QuizProgress
                    current={current}
                    total={total}
                    label={t('japanese.characterQuiz.progress')}
                />
                <button
                    type='button'
                    onClick={onEnd}
                    className='inline-flex shrink-0 items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-xs font-bold text-surface-muted transition-colors cursor-pointer hover:border-error hover:text-error'
                >
                    <FaXmark className='w-3 h-3' />
                    {t('japanese.characterQuiz.endGame')}
                </button>
            </div>

            <div className='grid grid-cols-3 gap-2 sm:gap-3'>
                <div className='flex items-center gap-2 rounded-sm bg-success/10 px-3 py-2'>
                    <FaCheck className='w-3.5 h-3.5 shrink-0 text-success' />
                    <div className='flex flex-col leading-tight'>
                        <span className='text-lg font-black text-success'>
                            {score}
                        </span>
                        <span className='text-[10px] font-semibold uppercase tracking-wide text-surface-muted'>
                            {t('japanese.characterQuiz.result.correctLabel')}
                        </span>
                    </div>
                </div>
                <div className='flex items-center gap-2 rounded-sm bg-error/10 px-3 py-2'>
                    <FaXmark className='w-3.5 h-3.5 shrink-0 text-error' />
                    <div className='flex flex-col leading-tight'>
                        <span className='text-lg font-black text-error'>
                            {wrongCount}
                        </span>
                        <span className='text-[10px] font-semibold uppercase tracking-wide text-surface-muted'>
                            {t('japanese.characterQuiz.result.wrongLabel')}
                        </span>
                    </div>
                </div>
                <div className='flex items-center gap-2 rounded-sm bg-warning/10 px-3 py-2'>
                    <FaClock className='w-3.5 h-3.5 shrink-0 text-warning' />
                    <div className='flex flex-col leading-tight'>
                        <span className='text-lg font-black text-warning'>
                            {timeoutCount}
                        </span>
                        <span className='text-[10px] font-semibold uppercase tracking-wide text-surface-muted'>
                            {t('japanese.characterQuiz.result.timeoutLabel')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}