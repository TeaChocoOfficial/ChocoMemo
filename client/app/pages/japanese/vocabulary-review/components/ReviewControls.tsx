// -Path: 'client/app/pages/japanese/vocabulary-review/components/ReviewControls.tsx'
import Button from '~/components/custom/Button';

interface ReviewControlsProps {
    revealed: boolean;
    onReveal: () => void;
    onAnswer: (pass: boolean) => void;
}

/** "Show answer" before reveal, then Fail/Pass which drive scheduling. */
export default function ReviewControls({ revealed, onReveal, onAnswer }: ReviewControlsProps) {
    if (!revealed) {
        return (
            <Button variant='primary' size='lg' onClick={onReveal}>
                Show answer
            </Button>
        );
    }

    return (
        <div className='flex gap-4'>
            <Button
                variant='secondary'
                size='lg'
                onClick={() => onAnswer(false)}
                className='border-error text-error hover:bg-error/10'
            >
                Fail
            </Button>
            <Button
                variant='primary'
                size='lg'
                onClick={() => onAnswer(true)}
                className='bg-success text-success-foreground hover:bg-success/90'
            >
                Pass
            </Button>
        </div>
    );
}
