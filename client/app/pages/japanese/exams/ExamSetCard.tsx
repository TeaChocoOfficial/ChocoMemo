// -Path: 'client/app/pages/japanese/vocabulary/ExamSetCard.tsx'
import { Link } from '~/i18n/routing';
import { FaDownload, FaTrash } from 'react-icons/fa6';
import Button from '~/components/custom/Button';
import type { ExamSet } from '~/types/exam';
import { exportExamSet } from '~/utils/exam';

interface ExamSetCardProps {
    examSet: ExamSet;
    onDelete?: () => void;
}

const SOURCE_LABEL: Record<ExamSet['source'], string> = {
    default: 'Default',
    custom: 'My set',
    imported: 'Imported',
};

export default function ExamSetCard({ examSet, onDelete }: ExamSetCardProps) {
    return (
        <div className='flex flex-col gap-2 rounded-sm border border-line bg-surface p-6'>
            <div className='flex items-start justify-between gap-3'>
                <div>
                    <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                        {SOURCE_LABEL[examSet.source]}
                    </p>
                    <h3 className='mt-1 text-lg font-bold tracking-tight text-surface-foreground'>
                        {examSet.title}
                    </h3>
                </div>
                <div className='flex gap-1'>
                    <button
                        type='button'
                        onClick={() => exportExamSet(examSet)}
                        aria-label='Export exam set'
                        title='Export'
                        className='inline-flex h-8 w-8 items-center justify-center rounded-sm text-surface-muted transition-colors cursor-pointer hover:bg-surface-overlay hover:text-accent'
                    >
                        <FaDownload className='w-4 h-4' />
                    </button>
                    {examSet.source !== 'default' && onDelete && (
                        <button
                            type='button'
                            onClick={onDelete}
                            aria-label='Delete exam set'
                            title='Delete'
                            className='inline-flex h-8 w-8 items-center justify-center rounded-sm text-surface-muted transition-colors cursor-pointer hover:bg-surface-overlay hover:text-error'
                        >
                            <FaTrash className='w-4 h-4' />
                        </button>
                    )}
                </div>
            </div>
            {examSet.description && (
                <p className='text-sm leading-relaxed text-surface-muted'>{examSet.description}</p>
            )}
            <p className='text-xs text-surface-muted tabular-nums'>{examSet.questions.length} questions</p>
            <Link to={`/japanese/exams/${examSet.id}`} className='mt-2 self-start'>
                <Button size='sm'>Start</Button>
            </Link>
        </div>
    );
}