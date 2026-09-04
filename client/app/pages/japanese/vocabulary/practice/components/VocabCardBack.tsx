// -Path: 'client/app/pages/japanese/vocabulary/practice/components/VocabCardBack.tsx'
import { FaPlay } from 'react-icons/fa6';
import { useSpeak } from '~/hooks/useSpeak';
import type { VocabWord } from '~/types/vocabulary';

interface VocabCardBackProps {
    word: VocabWord;
}

/** Answer reveal: reading, meaning, example with furigana over the target
 *  word, translation, optional image/note, and audio for both word and
 *  sentence. */
export default function VocabCardBack({ word }: VocabCardBackProps) {
    const speak = useSpeak();

    return (
        <div className='flex flex-col items-center gap-4 text-center'>
            <p className='text-sm text-surface-muted'>{word.reading}</p>
            <h2 className='text-6xl font-black text-surface-foreground'>{word.word}</h2>
            <p className='text-lg text-surface-foreground/80'>{word.meaning}</p>

            <div className='mt-2 space-y-1'>
                <p className='text-2xl'>
                    {word.example.before}
                    <ruby>
                        {word.word}
                        <rt className='text-xs text-primary'>{word.example.targetReading}</rt>
                    </ruby>
                    {word.example.after}
                </p>
                <p className='text-surface-muted'>{word.example.english}</p>
            </div>

            <div className='flex gap-3 mt-2'>
                <button
                    type='button'
                    onClick={() => speak(word.word, word.audioWordUrl)}
                    aria-label='Play word pronunciation'
                    className='w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90'
                >
                    <FaPlay className='w-3.5 h-3.5' />
                </button>
                <button
                    type='button'
                    onClick={() =>
                        speak(
                            word.example.before + word.word + word.example.after,
                            word.audioSentenceUrl,
                        )
                    }
                    aria-label='Play example sentence'
                    className='w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30'
                >
                    <FaPlay className='w-3.5 h-3.5' />
                </button>
            </div>

            {word.imageUrl && (
                <img src={word.imageUrl} alt={word.meaning} className='max-h-40 mt-2 rounded-xl' />
            )}

            {word.note && (
                <p className='text-xs text-surface-muted mt-2 max-w-sm'>Note: {word.note}</p>
            )}
        </div>
    );
}
