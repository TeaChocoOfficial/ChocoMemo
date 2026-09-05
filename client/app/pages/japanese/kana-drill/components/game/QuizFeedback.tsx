// -Path: 'client/app/pages/japanese/kana-drill/components/game/QuizFeedback.tsx'
// Feedback block shown after answering: correct / wrong / timeout with the
// correct answer, plus a Next Question button when auto-advance is off.
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Choice } from '~/hooks/useQuizEngine';

interface QuizFeedbackProps {
    lastChoice: Choice | null;
    timedOut: boolean;
    correctAnswerText: string;
    autoAdvance: boolean;
    onNext: () => void;
}

export default function QuizFeedback({
    lastChoice,
    timedOut,
    correctAnswerText,
    autoAdvance,
    onNext,
}: QuizFeedbackProps) {
    const { t } = useTranslation();

    const failed = timedOut || (lastChoice != null && !lastChoice.isCorrect);
    const message = timedOut
        ? `${t('japanese.kanaDrill.timeout')} ${t('japanese.kanaDrill.correctAnswer')}: ${correctAnswerText}`
        : lastChoice
          ? lastChoice.isCorrect
              ? t('japanese.kanaDrill.correct')
              : `${t('japanese.kanaDrill.wrong')} ${t('japanese.kanaDrill.correctAnswer')}: ${correctAnswerText}`
          : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-8 text-center'
        >
            <p className={`mb-4 text-lg font-bold ${failed ? 'text-error' : 'text-success'}`}>
                {message}
            </p>
            {!autoAdvance && (
                <button
                    type='button'
                    onClick={onNext}
                    className='px-8 py-3.5 rounded-sm bg-accent text-accent-foreground text-base font-semibold transition-colors duration-200 cursor-pointer hover:bg-accent-emphasis active:translate-y-px'
                >
                    {t('japanese.kanaDrill.next')}
                </button>
            )}
        </motion.div>
    );
}