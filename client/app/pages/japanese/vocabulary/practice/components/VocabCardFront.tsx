// -Path: 'client/app/pages/japanese/vocabulary/practice/components/VocabCardFront.tsx'
import type { VocabWord } from '~/types/vocabulary';

interface VocabCardFrontProps {
    word: VocabWord;
}

/** Recall prompt: word + example sentence only, no reading/meaning/
 *  translation — the user has to recall the meaning before revealing. */
export default function VocabCardFront({ word }: VocabCardFrontProps) {
    return (
        <div className='flex flex-col items-center gap-8 text-center'>
            <h2 className='text-6xl font-black text-surface-foreground'>{word.word}</h2>
            <p className='text-2xl text-surface-foreground/90'>
                {word.example.before}
                <span className='text-primary font-bold'>{word.word}</span>
                {word.example.after}
            </p>
        </div>
    );
}
