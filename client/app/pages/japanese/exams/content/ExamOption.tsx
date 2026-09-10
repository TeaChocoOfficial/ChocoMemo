// -Path: 'client/app/pages/japanese/vocabulary/exam/ExamOption.tsx'
// Up to 8 options (A–H); fewer remain unused when a question has fewer.
const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

interface ExamOptionProps {
    index: number;
    text: string;
    isSelected: boolean;
    isCorrect: boolean;
    answered: boolean;
    onClick: () => void;
}

export default function ExamOption({
    index,
    text,
    isSelected,
    isCorrect,
    answered,
    onClick,
}: ExamOptionProps) {
    let stateClass = 'border-line hover:border-accent hover:bg-accent-subtle';
    if (answered && isCorrect) stateClass = 'border-success bg-success-subtle text-success-emphasis';
    else if (answered && isSelected && !isCorrect)
        stateClass = 'border-error bg-error-subtle text-error-emphasis';
    else if (answered) stateClass = 'border-line opacity-60';

    return (
        <button
            type='button'
            disabled={answered}
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-sm border text-left transition-colors cursor-pointer disabled:pointer-events-none ${stateClass}`}
        >
            <span className='font-bold text-surface-muted'>{LABELS[index]}</span>
            <span className='font-medium text-surface-foreground'>{text}</span>
        </button>
    );
}