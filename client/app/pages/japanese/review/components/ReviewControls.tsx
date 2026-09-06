import { useTranslation } from 'react-i18next';
import { FaCheck, FaEye, FaXmark } from 'react-icons/fa6';
import Button from '~/components/custom/Button';

interface ReviewControlsProps {
    revealed: boolean;
    onReveal: () => void;
    onAnswer: (pass: boolean) => void;
}

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className='rounded-sm border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-[10px] font-bold text-surface-muted'>
            {children}
        </kbd>
    );
}

/** "Show answer" before reveal, then Fail/Pass which drive scheduling. */
export default function ReviewControls({ revealed, onReveal, onAnswer }: ReviewControlsProps) {
    const { t } = useTranslation();

    if (!revealed) {
        return (
            <div className='flex flex-col items-center gap-3'>
                <Button size='lg' onClick={onReveal} className='min-w-[13rem]'>
                    <FaEye className='h-4 w-4' />
                    {t('japanese.vocabularyReview.showAnswer')}
                </Button>
                <span className='inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-surface-muted/70'>
                    <Kbd>SPC</Kbd>
                </span>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center gap-4'>
            <div className='flex gap-4'>
                <Button
                    size='lg'
                    variant='secondary'
                    onClick={() => onAnswer(false)}
                    className='group min-w-[10rem] border-error/40 bg-error/5 text-error hover:border-error hover:bg-error/10'
                >
                    <FaXmark className='h-4 w-4' />
                    {t('japanese.vocabularyReview.fail')}
                </Button>
                <Button
                    size='lg'
                    onClick={() => onAnswer(true)}
                    className='min-w-[10rem] bg-success text-success-foreground hover:bg-success/90'
                >
                    <FaCheck className='h-4 w-4' />
                    {t('japanese.vocabularyReview.pass')}
                </Button>
            </div>
            <span className='inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-surface-muted/70'>
                <span className='inline-flex items-center gap-1.5'>
                    <Kbd>F</Kbd> {t('japanese.vocabularyReview.failHint')}
                </span>
                <span className='h-3 w-px bg-line-strong' />
                <span className='inline-flex items-center gap-1.5'>
                    <Kbd>J</Kbd> {t('japanese.vocabularyReview.passHint')}
                </span>
            </span>
        </div>
    );
}
