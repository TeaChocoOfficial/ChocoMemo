// -Path: 'client/app/pages/japanese/vocabulary-review/VocabularyReview.tsx'
import { useEffect } from 'react';
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import SessionReview from './content/SessionReview';
import SessionComplete from './content/SessionComplete';
import { useVocabularyStore } from '~/stores/vocabulary.store';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { useVocabularySession } from '~/hooks/useVocabularySession';

export default function VocabularyReviewPage() {
    const { t } = useTranslation();
    const { custom } = useVocabularyStore();
    const words = [...DEFAULT_VOCABULARY, ...custom];
    const { reveal, answer, revealed, remaining, currentWord, isSessionComplete } =
        useVocabularySession(words);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (!currentWord) return;
            if (!revealed && e.code === 'Space') {
                e.preventDefault();
                reveal();
            } else if (revealed && (e.key === 'f' || e.key === 'ArrowLeft')) answer(false);
            else if (revealed && (e.key === 'j' || e.key === 'ArrowRight')) answer(true);
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [currentWord, revealed, reveal, answer]);

    return (
        <section className='flex relative min-h-screen overflow-hidden py-16 sm:py-20'>
            <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full min-h-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors self-start'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.vocabularyReview.exit')}
                </Link>
                {isSessionComplete ? (
                    <SessionComplete />
                ) : (
                    <SessionReview
                        answer={answer}
                        reveal={reveal}
                        revealed={revealed}
                        remaining={remaining}
                        currentWord={currentWord}
                    />
                )}
            </div>
        </section>
    );
}
