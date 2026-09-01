// -Path: 'client/app/pages/japanese/vocabulary/quiz/components/VocabQuestion.tsx'
import { motion } from 'framer-motion';

interface VocabQuestionProps {
    prompt: string;
    promptHint?: string;
    current: number;
    promptLabel: string;
}

export default function VocabQuestion({ prompt, promptHint, current, promptLabel }: VocabQuestionProps) {
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
            <div className='flex flex-col items-center gap-2'>
                <span className='text-8xl sm:text-9xl font-bold text-surface-foreground leading-none'>
                    {prompt}
                </span>
                {promptHint && (
                    <span className='text-lg text-surface-subtle'>{promptHint}</span>
                )}
            </div>
        </motion.div>
    );
}
