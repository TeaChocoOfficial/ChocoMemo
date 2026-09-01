// -Path: 'client/app/pages/japanese/characters/quiz/components/QuizQuestion.tsx'
import { motion } from 'framer-motion';

interface QuizQuestionProps {
    prompt: string;
    promptHint?: string;
    current: number;
    promptLabel: string;
}

export default function QuizQuestion({ prompt, promptHint, current, promptLabel }: QuizQuestionProps) {
    return (
        <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className='text-center mb-8'
        >
            <p className='text-sm font-medium uppercase tracking-widest text-surface-muted mb-6'>
                {promptLabel}
            </p>
            <div className='flex flex-col items-center gap-4'>
                <span className='text-8xl sm:text-9xl font-bold text-surface-foreground leading-none'>
                    {prompt}
                </span>
                {promptHint && (
                    <span className='text-lg text-surface-muted'>{promptHint}</span>
                )}
            </div>
        </motion.div>
    );
}
