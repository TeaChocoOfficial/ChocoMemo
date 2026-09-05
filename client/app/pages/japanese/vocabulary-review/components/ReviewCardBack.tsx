// -Path: 'client/app/pages/japanese/vocabulary-review/components/ReviewCardBack.tsx'
import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaCopy, FaPlay } from 'react-icons/fa6';
import { useSpeak } from '~/hooks/useSpeak';
import { useVocabMeaning } from '~/hooks/useVocabMeaning';
import type { VocabSegment, VocabWord } from '~/types/vocabulary';
import {
    VocabTip,
    RubySegments,
    displaySegments,
    exampleSentence,
    RubySentenceRun,
    tokenizeSentencePart,
} from '../hooks/segments';

interface ReviewCardBackProps {
    word: VocabWord;
    words: VocabWord[];
}

/** Answer reveal: reading, meaning, example with per-character furigana over
 *  the highlighted target, translation, optional image/note, and audio for
 *  both word and sentence. Hovering any segment that is a known vocabulary
 *  item shows that item's details. The word is read aloud automatically,
 *  followed by the example sentence. */
export default function ReviewCardBack({ word, words }: ReviewCardBackProps) {
    const speak = useSpeak();
    const meaning = useVocabMeaning();
    const segments = displaySegments(word);

    const speakRef = useRef(speak);
    speakRef.current = speak;
    useEffect(() => {
        speakRef.current(word.word, word.audioWordUrl, () => {
            speakRef.current(exampleSentence(word), word.audioSentenceUrl);
        });
    }, []);

    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const copyText = (key: string, text: string) => {
        void navigator.clipboard.writeText(text);
        setCopiedKey(key);
        window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    };

    const copyButton = (key: string, text: string, label: string, position = '') => {
        const copied = copiedKey === key;
        return (
            <button
                type='button'
                onClick={() => copyText(key, text)}
                aria-label={copied ? 'Copied' : `Copy ${label}`}
                title={copied ? 'Copied' : `Copy ${label}`}
                className={`${position} w-6 h-6 flex items-center justify-center cursor-pointer transition-colors ${
                    copied ? 'text-primary' : 'text-surface-muted hover:text-primary'
                }`}
            >
                {copied ? <FaCheck className='w-3 h-3' /> : <FaCopy className='w-3 h-3' />}
            </button>
        );
    };

    const renderPart = (part: VocabSegment[]) =>
        tokenizeSentencePart(part, words).map((run, i) => <RubySentenceRun key={i} run={run} />);

    return (
        <div className='flex flex-col items-center gap-4 text-center'>
            <p className='text-sm text-surface-muted'>{word.reading}</p>
            <div className='relative inline-flex items-center justify-center'>
                <h2 className='text-6xl font-black text-surface-foreground'>{word.word}</h2>
                {copyButton('word', word.word, 'word', 'absolute top-1/2 -translate-y-1/2 -right-11')}
            </div>
            <p className='text-lg text-surface-foreground/80'>{meaning(word.meaning)}</p>

            <div className='flex flex-col mt-2 gap-2 items-center'>
                <div className='relative inline-flex items-center justify-center'>
                    <p className='text-2xl'>
                        {renderPart(word.example.before)}
                        <span className='text-primary font-bold'>
                            <VocabTip word={word}>
                                <RubySegments segments={segments} />
                            </VocabTip>
                        </span>
                        {renderPart(word.example.after)}
                    </p>
                    {copyButton('example', exampleSentence(word), 'example', 'absolute top-1/2 -translate-y-1/2 -right-11')}
                </div>
                <div className='relative inline-flex items-center justify-center'>
                    <p className='text-surface-muted'>{meaning(word.example.meaning)}</p>
                    {copyButton('example-meaning', meaning(word.example.meaning), 'example meaning', 'absolute top-1/2 -translate-y-1/2 -right-11')}
                </div>
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
                    onClick={() => speak(exampleSentence(word), word.audioSentenceUrl)}
                    aria-label='Play example sentence'
                    className='w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30'
                >
                    <FaPlay className='w-3.5 h-3.5' />
                </button>
            </div>

            {word.imageUrl && (
                <img
                    src={word.imageUrl}
                    alt={meaning(word.meaning)}
                    className='max-h-40 mt-2 rounded-xl'
                />
            )}

            {word.note && (
                <>
                    <div className='relative inline-flex items-center justify-center'>
                        <p className='text-xs text-surface-muted mt-2 max-w-sm'>
                            Note: {meaning(word.note)}
                        </p>
                        {copyButton('note', meaning(word.note), 'note', 'absolute top-1/2 -translate-y-1/2 -right-11')}
                    </div>
                </>
            )}
        </div>
    );
}
