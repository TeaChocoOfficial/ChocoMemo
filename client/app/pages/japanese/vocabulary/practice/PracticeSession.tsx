// -Path: 'client/app/pages/japanese/vocabulary/practice/PracticeSession.tsx'
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import { useVocabularySession } from '~/hooks/useVocabularySession';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { useVocabularyStore } from '~/stores/vocabulary.store';
import VocabCardFront from './components/VocabCardFront';
import VocabCardBack from './components/VocabCardBack';
import VocabControls from './components/VocabControls';

export default function PracticeSession() {
    const { t } = useTranslation();
    const { custom } = useVocabularyStore();
    const words = [...DEFAULT_VOCABULARY, ...custom];
    const { currentWord, revealed, reveal, answer, remaining, isSessionComplete } =
        useVocabularySession(words);

    // Space = reveal, F/← = fail, J/→ = pass — mirrors Anki's own bindings.
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (!currentWord) return;
            if (!revealed && e.code === 'Space') {
                e.preventDefault();
                reveal();
            } else if (revealed && (e.key === 'f' || e.key === 'ArrowLeft')) {
                answer(false);
            } else if (revealed && (e.key === 'j' || e.key === 'ArrowRight')) {
                answer(true);
            }
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [currentWord, revealed, reveal, answer]);

    const exitLink = (
        <Link
            to='/japanese/vocabulary'
            className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors self-start'
        >
            <FaArrowLeft className='w-3.5 h-3.5' />
            {t('japanese.practice.exit')}
        </Link>
    );

    if (isSessionComplete) {
        return (
            <div className='flex flex-col items-start justify-start min-h-[60vh] py-16 px-4'>
                {exitLink}
                <div className='flex-1 flex flex-col items-center justify-center gap-3 w-full'>
                    <p className='text-2xl font-bold text-surface-foreground'>
                        {t('japanese.practice.complete')}
                    </p>
                    <p className='text-surface-muted'>
                        {t('japanese.practice.completeDescription')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-start min-h-[70vh] gap-10 py-16 px-4'>
            {exitLink}
            <p className='text-sm text-surface-muted'>
                {remaining} {remaining !== 1 ? t('japanese.practice.wordsLeft') : t('japanese.practice.wordLeft')}
            </p>

            {currentWord && (
                <motion.div
                    key={currentWord.id + (revealed ? '-back' : '-front')}
                    initial={{ opacity: 0, rotateY: -10 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {revealed ? (
                        <VocabCardBack word={currentWord} />
                    ) : (
                        <VocabCardFront word={currentWord} />
                    )}
                </motion.div>
            )}

            <VocabControls revealed={revealed} onReveal={reveal} onAnswer={answer} />
        </div>
    );
}
