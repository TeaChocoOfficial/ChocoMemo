// -Path: 'client/app/pages/japanese/characters/quiz/components/QuizTimer.tsx'
// Per-question countdown bar for the character quiz.
import { motion } from 'framer-motion';

interface QuizTimerProps {
    timeLeft: number;
    timeLimit: number;
}

export default function QuizTimer({ timeLeft, timeLimit }: QuizTimerProps) {
    const percent = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 0;
    const urgent = timeLeft <= 3;

    return (
        <div className='flex items-center gap-3'>
            <span
                className={`text-sm font-bold tabular-nums ${urgent ? 'text-error' : 'text-surface-foreground'}`}
            >
                {timeLeft}s
            </span>
            <div className='h-2 flex-1 bg-surface-overlay border border-line overflow-hidden'>
                <motion.div
                    className={`h-full ${urgent ? 'bg-error' : 'bg-accent'}`}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    );
}