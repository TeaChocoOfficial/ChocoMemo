import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { VocabWord } from '~/types/vocabulary';
import { stopSpeaking } from '~/hooks/useSpeak';
import ReviewControls from '../components/ReviewControls';
import ReviewCardBack from './ReviewCardBack';
import ReviewCardFront from './ReviewCardFront';

const cardMotion = {
    initial: { opacity: 0, scale: 0.98, y: 12 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -12 },
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

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

    // The back card starts reading aloud on reveal; stop the reading the
    // moment it is dismissed so audio doesn't bleed into the next card.
    useEffect(() => {
        if (!revealed) stopSpeaking();
    }, [revealed]);

    if (!currentWord) {
        return (
            <div className='flex flex-col items-center justify-center py-24 text-center'>
                <p className='font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent'>
                    {t('japanese.vocabularyReview.badge')}
                </p>
                <h2 className='mt-4 text-4xl font-black tracking-tight text-surface-foreground'>
                    {t('japanese.vocabularyReview.complete')}
                </h2>
                <p className='mt-3 max-w-md text-sm leading-relaxed text-surface-muted'>
                    {t('japanese.vocabularyReview.completeDescription')}
                </p>
            </div>
        );
    }

    const progress = Math.max(0, Math.min(100, (remaining / words.length) * 100));

    return (
        <div className='flex h-full flex-col'>
            <div className='mb-6 shrink-0'>
                <div className='flex items-center justify-between gap-4 mb-3'>
                    <span className='font-mono text-xs font-bold uppercase tracking-[0.14em] text-accent'>
                        {t('japanese.vocabularyReview.badge')}
                    </span>
                    <span className='font-mono text-xs font-semibold uppercase tracking-[0.14em] text-surface-muted tabular-nums'>
                        {remaining}{' '}
                        {remaining !== 1
                            ? t('japanese.vocabularyReview.wordsLeft')
                            : t('japanese.vocabularyReview.wordLeft')}
                    </span>
                </div>
                <div className='h-px w-full bg-line'>
                    <div
                        className='h-px bg-accent transition-all duration-500 ease-out'
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className='perspective-[1400px] min-h-0 flex-1'>
                <AnimatePresence mode='wait' initial={false}>
                    <motion.div
                        key={currentWord.id + (revealed ? '-back' : '-front')}
                        {...cardMotion}
                        className='flex h-full min-h-0 flex-col rounded-sm border border-line bg-surface'
                    >
                        {revealed ? (
                            <ReviewCardBack word={currentWord} words={words} />
                        ) : (
                            <ReviewCardFront word={currentWord} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className='mt-6 flex shrink-0 justify-center'>
                <ReviewControls revealed={revealed} onReveal={reveal} onAnswer={answer} />
            </div>
        </div>
    );
}
