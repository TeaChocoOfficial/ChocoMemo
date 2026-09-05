import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { VocabWord } from '~/types/vocabulary';
import ReviewControls from '../components/ReviewControls';
import ReviewCardBack from '../components/ReviewCardBack';
import ReviewCardFront from '../components/ReviewCardFront';

export default function SessionReview({
    words,
    answer,
    reveal,
    revealed,
    remaining,
    currentWord,
}: {
    revealed: boolean;
    remaining: number;
    reveal: () => void;
    words: VocabWord[];
    currentWord: VocabWord | null;
    answer: (pass: boolean) => void;
}) {
    const { t } = useTranslation();

    return (
        <div className='flex flex-col justify-between h-full'>
            {currentWord && (
                <motion.div
                    key={currentWord.id + (revealed ? '-back' : '-front')}
                    initial={{ opacity: 0, rotateY: -10 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {revealed ? (
                        <ReviewCardBack word={currentWord} words={words} />
                    ) : (
                        <ReviewCardFront word={currentWord} />
                    )}
                </motion.div>
            )}
            <div className='w-full flex flex-col items-center'>
                <p className='text-sm text-surface-muted'>
                    {remaining}{' '}
                    {remaining !== 1
                        ? t('japanese.vocabularyReview.wordsLeft')
                        : t('japanese.vocabularyReview.wordLeft')}
                </p>

                <ReviewControls revealed={revealed} onReveal={reveal} onAnswer={answer} />
            </div>
        </div>
    );
}
