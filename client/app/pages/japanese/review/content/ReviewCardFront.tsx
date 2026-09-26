import { useTranslation } from 'react-i18next';
import type { VocabWord } from '~/types/vocabulary';
import { displaySegments, segmentsToText } from '../hooks/segments';

interface ReviewCardFrontProps {
    word: VocabWord;
}

/** Recall prompt: word + example sentence only, no reading/meaning/
 *  translation — the user has to recall the meaning before revealing.
 *  The target surface form in the sentence is highlighted. */
export default function ReviewCardFront({ word }: ReviewCardFrontProps) {
    const { t } = useTranslation();

    return (
        <div className='flex h-full flex-col overflow-y-auto px-8 py-10 sm:px-12'>
            <p className='mb-8 shrink-0 text-center font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-surface-muted'>
                {t('japanese.vocabularyReview.wordLabel')}
            </p>

            <div className='flex flex-1 flex-col items-center justify-center gap-10 text-center'>
                <h2 className='text-6xl font-black leading-none tracking-tighter text-surface-foreground sm:text-7xl'>
                    {word.word}
                </h2>

                <div className='flex flex-col items-center gap-4'>
                    <div className='h-px w-16 bg-line-strong' />
                    <p className='max-w-md text-xl leading-relaxed text-surface-foreground/90 sm:text-2xl'>
                        {segmentsToText(word.example.before)}
                        <span className='rounded-sm bg-primary/15 px-1 py-0.5 font-bold text-primary'>
                            {segmentsToText(displaySegments(word))}
                        </span>
                        {segmentsToText(word.example.after)}
                    </p>
                    <p className='text-sm text-surface-muted'>
                        {t('japanese.vocabularyReview.recallPrompt')}
                    </p>
                </div>
            </div>
        </div>
    );
}
