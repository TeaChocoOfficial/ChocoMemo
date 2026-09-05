// -Path: 'client/app/pages/japanese/kana-drill/components/game/QuizProgress.tsx'
import { motion } from 'framer-motion';

interface QuizProgressProps {
    current: number;
    total: number;
    label?: string;
}

export default function QuizProgress({ current, total, label }: QuizProgressProps) {
    const progress = total > 0 ? (current / total) * 100 : 0;

    return (
        <div className='w-full'>
            <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-surface-muted'>{label}</span>
                <span className='text-sm font-bold text-surface-foreground'>
                    {current} / {total}
                </span>
            </div>
            <div className='h-2 w-full bg-surface-overlay border border-line overflow-hidden'>
                <motion.div
                    className='h-full bg-accent'
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}
