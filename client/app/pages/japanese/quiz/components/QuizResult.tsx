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

    const rank = percentage >= 90 ? '秀' : percentage >= 70 ? '優' : percentage >= 50 ? '良' : '可';

    const rankColor =
        percentage >= 70
            ? 'text-success'
            : percentage >= 50
              ? 'text-warning'
              : 'text-error';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='max-w-md mx-auto text-center rounded-sm border border-line bg-surface p-10'
        >
            <div className={`text-7xl font-black leading-none mb-6 ${rankColor}`}>{rank}</div>
            <h2 className='text-3xl font-black tracking-tight text-surface-foreground mb-2'>
                {title}
            </h2>
            <p className='text-lg text-surface-muted mb-8'>
                {score} / {total} · {percentage}%
            </p>

            <div className='relative h-2 w-full bg-surface-overlay border border-line overflow-hidden mb-8'>
                <motion.div
                    className={`h-full ${percentage >= 70 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-error'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                />
            </div>

            <button
                type='button'
                onClick={onRetry}
                className='inline-flex items-center gap-2 px-7 py-3.5 rounded-sm bg-accent text-accent-foreground text-base font-semibold transition-colors duration-200 cursor-pointer hover:bg-accent-emphasis active:translate-y-px'
            >
                <FaRotateRight className='w-4 h-4' />
                {retryLabel}
            </button>
        </motion.div>
    );
}