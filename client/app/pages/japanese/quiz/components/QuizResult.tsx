// -Path: 'client/app/pages/japanese/quiz/components/QuizResult.tsx'
import { motion } from 'framer-motion';
import { FaRotateRight } from 'react-icons/fa6';

interface QuizResultProps {
    score: number;
    total: number;
    title: string;
    retryLabel: string;
    onRetry: () => void;
}

export default function QuizResult({ score, total, title, retryLabel, onRetry }: QuizResultProps) {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    const emoji = percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '📚';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className='max-w-md mx-auto text-center'
        >
            <div className='text-6xl mb-6'>{emoji}</div>
            <h2 className='text-3xl font-black tracking-tight text-surface-foreground mb-2'>
                {title}
            </h2>
            <p className='text-lg text-surface-muted mb-8'>
                {score} / {total} · {percentage}%
            </p>

            <div className='relative h-4 w-full rounded-full bg-surface-overlay border border-border overflow-hidden mb-8'>
                <motion.div
                    className={`h-full rounded-full ${percentage >= 70 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-error'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                />
            </div>

            <button
                type='button'
                onClick={onRetry}
                className='inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all duration-300 cursor-pointer active:scale-95'
            >
                <FaRotateRight className='w-4 h-4' />
                {retryLabel}
            </button>
        </motion.div>
    );
}
