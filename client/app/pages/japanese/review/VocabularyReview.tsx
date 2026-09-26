// -Path: 'client/app/pages/japanese/review/VocabularyReview.tsx'
import { useEffect } from 'react';
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import SessionReview from './content/SessionReview';
import { useVocabularySession } from '~/hooks/useVocabularySession';
import { findDeck, deckWords } from '~/stores/deck.store';
import Section from '~/components/custom/Section';

export default function VocabularyReviewPage() {
    const { t } = useTranslation();
    const { deckId } = useParams<{ deckId: string }>();
    const deck = deckId ? findDeck(deckId) : undefined;
    const words = deck ? deckWords(deck) : [];
    const { reveal, answer, revealed, remaining, currentWord } = useVocabularySession(words);

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
        <Section className='flex relative h-dvh overflow-hidden'>
            <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full flex min-h-0 flex-col'>
                <Link
                    to='/japanese/review'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors self-start shrink-0'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.vocabularyReview.exit')}
                </Link>
                <div className='min-h-0 flex-1'>
                    {deck ? (
                        <SessionReview
                            key={deck.id}
                            answer={answer}
                            reveal={reveal}
                            revealed={revealed}
                            remaining={remaining}
                            currentWord={currentWord}
                            words={words}
                        />
                    ) : (
                        <div className='flex flex-col items-center justify-center py-24 text-center'>
                            <p className='text-sm text-surface-muted'>
                                {t('japanese.decks.notFound')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}