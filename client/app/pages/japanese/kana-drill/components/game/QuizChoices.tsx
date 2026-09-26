// -Path: 'client/app/pages/japanese/kana-drill/components/game/QuizChoices.tsx'
import { motion } from 'framer-motion';
import type { Choice } from '~/hooks/useQuizEngine';

export type ChoiceFeedback = 'idle' | 'selected' | 'correct' | 'wrong';

interface QuizChoicesProps {
    choices: Choice[];
    feedback: Record<string, ChoiceFeedback>;
    disabled: boolean;
    onSelect: (choice: Choice) => void;
}

const stateClasses: Record<ChoiceFeedback, string> = {
    idle: 'border-line bg-surface hover:border-primary hover:bg-surface-overlay text-surface-foreground',
    selected: 'border-primary bg-primary/15 text-surface-foreground',
    correct: 'border-success bg-success/15 text-success',
    wrong: 'border-error bg-error/15 text-error',
};

export default function QuizChoices({ choices, feedback, disabled, onSelect }: QuizChoicesProps) {
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
                        className={`px-5 py-4 rounded-sm border text-left text-base font-semibold transition-colors duration-200 cursor-pointer disabled:pointer-events-none ${stateClasses[state]}`}
                    >
                        {choice.label}
                    </motion.button>
                );
            })}
        </div>
    );
}
