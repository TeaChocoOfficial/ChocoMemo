// -Path: 'client/app/pages/japanese/vocabulary-review/components/ReviewCardFront.tsx'
import type { VocabWord } from '~/types/vocabulary';
import { displaySegments, segmentsToText } from '../hooks/segments';

interface ReviewCardFrontProps {
    word: VocabWord;
}

/** Recall prompt: word + example sentence only, no reading/meaning/
 *  translation — the user has to recall the meaning before revealing.
 *  The target surface form in the sentence is highlighted. */
export default function ReviewCardFront({ word }: ReviewCardFrontProps) {
    return (
        <div className='flex flex-col items-center gap-8 text-center'>
            <h2 className='text-6xl font-black text-surface-foreground'>{word.word}</h2>
            <p className='text-2xl text-surface-foreground/90'>
                {segmentsToText(word.example.before)}
                <span className='text-primary font-bold'>
                    {segmentsToText(displaySegments(word))}
                </span>
                {segmentsToText(word.example.after)}
            </p>
        </div>
    );
}