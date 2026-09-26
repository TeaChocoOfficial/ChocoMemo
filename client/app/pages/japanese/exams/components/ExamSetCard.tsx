// -Path: 'client/app/pages/japanese/exams/components/ExamSetCard.tsx'
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { FaArrowRight, FaDownload, FaTrash } from 'react-icons/fa6';
import { WashiTape, StrengthMeter } from '~/components/custom/TastingNotes';
import type { ExamSet } from '~/types/exam';
import { exportExamSet } from '~/utils/exam';

interface ExamSetCardProps {
    examSet: ExamSet;
    index?: number;
    onDelete?: () => void;
}

const SOURCE_KEY: Record<ExamSet['source'], string> = {
    default: 'japanese.exams.card.source.default',
    custom: 'japanese.exams.card.source.custom',
    imported: 'japanese.exams.card.source.imported',
};

const SOURCE_TAPE: Record<ExamSet['source'], `#${string}`> = {
    default: '#e8c47a',
    custom: '#c9b6e4',
    imported: '#b8d8af',
};

const FULL_STRENGTH_QUESTIONS = 40;

export default function ExamSetCard({ examSet, index = 0, onDelete }: ExamSetCardProps) {
    const { t } = useTranslation();
    const questions = examSet.questions.length;
    const fillPct = Math.min(100, (questions / FULL_STRENGTH_QUESTIONS) * 100);

    return (
        <motion.div
            className='h-full'
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
        >
            <div className='relative flex h-full flex-col rounded-[3px] border border-line-strong bg-surface-elevated px-6 pb-6 pt-8 transition-shadow duration-200 hover:shadow-[0_16px_32px_-20px_rgba(0,0,0,0.4)]'>
                <WashiTape label={t(SOURCE_KEY[examSet.source])} tone={SOURCE_TAPE[examSet.source]} />

                <div className='flex items-start justify-between gap-4'>
                    <div className='min-w-0 flex-1'>
                        <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-surface-muted'>
                            {t('japanese.exams.card.note')}
                        </p>
                        <h3 className='mt-1 font-sans text-xl font-bold leading-snug tracking-tight text-surface-foreground'>
                            {examSet.title}
                        </h3>
                    </div>
                    <div className='flex shrink-0 gap-1'>
                        <button
                            type='button'
                            onClick={() => exportExamSet(examSet)}
                            aria-label={t('japanese.exams.card.exportAria')}
                            title={t('japanese.exams.card.export')}
                            className='inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-primary'
                        >
                            <FaDownload className='h-4 w-4' />
                        </button>
                        {examSet.source !== 'default' && onDelete && (
                            <button
                                type='button'
                                onClick={onDelete}
                                aria-label={t('japanese.exams.card.deleteAria')}
                                title={t('japanese.exams.card.delete')}
                                className='inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-error'
                            >
                                <FaTrash className='h-4 w-4' />
                            </button>
                        )}
                    </div>
                </div>

                {examSet.description ? (
                    <p className='mt-2 flex-1 text-sm leading-relaxed text-surface-subtle'>
                        {examSet.description}
                    </p>
                ) : (
                    <p className='mt-2 flex-1' />
                )}

                <div className='mt-5'>
                    <StrengthMeter
                        value={t('japanese.exams.card.question', { count: questions })}
                        fillPct={fillPct}
                    />
                </div>

                <div className='mt-6 flex flex-1 items-end justify-between gap-3'>
                    {examSet.authorName && examSet.source === 'imported' ? (
                        <span className='font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                            {t('japanese.exams.card.byAuthor', { author: examSet.authorName })}
                        </span>
                    ) : (
                        <span className='font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                            {t(SOURCE_KEY[examSet.source])}
                        </span>
                    )}
                    <Link
                        to={`/japanese/exams/${examSet.id}`}
                        className='group/link inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline'
                    >
                        {t('japanese.exams.card.start')}
                        <FaArrowRight className='h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1' />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}