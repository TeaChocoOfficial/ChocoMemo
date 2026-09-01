// -Path: 'client/app/pages/japanese/vocabulary/quiz/components/VocabChoices.tsx'
import { motion } from 'framer-motion';
import type { Choice } from '~/hooks/useQuizEngine';

export type VocabChoiceFeedback = 'idle' | 'selected' | 'correct' | 'wrong';

interface VocabChoicesProps {
    choices: Choice[];
    feedback: Record<string, VocabChoiceFeedback>;
    disabled: boolean;
    onSelect: (choice: Choice) => void;
}

const stateClasses: Record<VocabChoiceFeedback, string> = {
    idle: 'border-border bg-surface-elevated hover:border-primary/40 hover:bg-surface-overlay text-surface-foreground',
    selected: 'border-accent bg-accent/10 text-surface-foreground',
    correct: 'border-success bg-success/15 text-success',
    wrong: 'border-error bg-error/15 text-error',
};

export default function VocabChoices({ choices, feedback, disabled, onSelect }: VocabChoicesProps) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            {choices.map((choice, index) => {
                const state = feedback[choice.id] ?? 'idle';
                return (
                    <motion.button
                        key={choice.id}
                        type='button'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        disabled={disabled}
                        onClick={() => onSelect(choice)}
                        className={`px-5 py-4 rounded-xl border-2 text-left text-base font-semibold transition-all duration-300 cursor-pointer disabled:pointer-events-none ${stateClasses[state]}`}
                    >
                        {choice.label}
                    </motion.button>
                );
            })}
        </div>
    );
}
