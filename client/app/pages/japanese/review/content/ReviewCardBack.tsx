import { useEffect, useRef, useState } from 'react';
import { FaCheck, FaCopy, FaPlay } from 'react-icons/fa6';
import { useSpeak, stopSpeaking } from '~/hooks/useSpeak';
import { useLangText } from '~/hooks/useLangText';
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

const copyButton = (
    key: string,
    text: string,
    copiedKey: string | null,
    onCopy: (key: string, text: string) => void,
) => {
    const copied = copiedKey === key;
    return (
        <button
            type='button'
            onClick={() => onCopy(key, text)}
            aria-label={copied ? 'Copied' : `Copy ${key}`}
            title={copied ? 'Copied' : `Copy ${key}`}
            className='inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-line bg-surface text-surface-muted transition-colors cursor-pointer hover:border-accent hover:text-primary'
        >
            {copied ? <FaCheck className='h-2.5 w-2.5' /> : <FaCopy className='h-2.5 w-2.5' />}
        </button>
    );
};

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className='text-center font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-surface-muted'>
            {children}
        </p>
    );
}

/** Answer reveal: reading, meaning, example with per-character furigana over
 *  the highlighted target, translation, optional image/note, and audio for
 *  both word and sentence. Hovering any segment that is a known vocabulary
 *  item shows that item's details. The word is read aloud automatically. */
export default function ReviewCardBack({ word, words }: ReviewCardBackProps) {
    const speak = useSpeak();
    const meaning = useLangText();
    const segments = displaySegments(word);

    const speakRef = useRef(speak);
    speakRef.current = speak;
    useEffect(() => {
        speakRef.current(word.word, word.audioWordUrl, () => {
            speakRef.current(exampleSentence(word), word.audioSentenceUrl);
        });
        return () => stopSpeaking();
    }, [word.word, word.audioWordUrl, word.audioSentenceUrl]);

    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const copyText = (key: string, text: string) => {
        void navigator.clipboard.writeText(text);
        setCopiedKey(key);
        window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    };

    const renderPart = (part: VocabSegment[]) =>
        tokenizeSentencePart(part, words).map((run, i) => <RubySentenceRun key={i} run={run} />);

    return (
        <div className='flex h-full flex-col overflow-y-auto px-8 py-10 sm:px-12'>
            <div className='mb-6 shrink-0 flex justify-center gap-2'>
                <button
                    type='button'
                    onClick={() => speak(word.word, word.audioWordUrl)}
                    aria-label='Play word pronunciation'
                    className='inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs font-semibold text-surface-foreground transition-colors cursor-pointer hover:border-accent hover:text-primary active:translate-y-px'
                >
                    <FaPlay className='h-2.5 w-2.5' />
                    {word.word}
                </button>
                <button
                    type='button'
                    onClick={() => speak(exampleSentence(word), word.audioSentenceUrl)}
                    aria-label='Play example sentence'
                    className='inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs font-semibold text-surface-muted transition-colors cursor-pointer hover:border-accent hover:text-primary active:translate-y-px'
                >
                    <FaPlay className='h-2.5 w-2.5' />
                    {word.reading}
                </button>
            </div>

            <div className='flex flex-col items-center gap-8'>
                <div className='flex flex-col items-center gap-2.5 text-center'>
                    <h2 className='text-6xl font-black leading-none tracking-tighter text-surface-foreground sm:text-7xl'>
                        {word.word}
                    </h2>
                    <div className='flex items-center gap-3'>
                        <span className='rounded-sm bg-surface-overlay px-3 py-1 font-mono text-sm text-surface-muted'>
                            {word.reading}
                        </span>
                        {copyButton('word', word.word, copiedKey, copyText)}
                    </div>
                </div>

                <div className='flex flex-col items-center gap-2 text-center'>
                    <div className='h-px w-16 bg-line-strong' />
                    <p className='text-xl font-bold text-surface-foreground'>
                        {meaning(word.meaning)}
                    </p>
                    {copyButton('meaning', meaning(word.meaning), copiedKey, copyText)}
                </div>

                <div className='flex flex-col items-center gap-3'>
                    <SectionLabel>Example</SectionLabel>
                    <p className='max-w-md text-xl leading-relaxed text-surface-foreground/90'>
                        {renderPart(word.example.before)}
                        <span className='rounded-sm bg-accent/15 px-1 py-0.5 font-bold text-primary'>
                            <VocabTip word={word}>
                                <RubySegments segments={segments} primary />
                            </VocabTip>
                        </span>
                        {renderPart(word.example.after)}
                    </p>
                    <div className='flex items-start gap-2'>
                        <p className='text-sm text-surface-muted'>
                            {meaning(word.example.meaning)}
                        </p>
                        {copyButton('example', exampleSentence(word), copiedKey, copyText)}
                    </div>
                </div>

                {word.imageUrl && (
                    <img
                        src={word.imageUrl}
                        alt={meaning(word.meaning)}
                        className='max-h-44 rounded-sm border border-line'
                    />
                )}

                {word.note && (
                    <div className='flex flex-col items-center gap-2'>
                        <SectionLabel>Note</SectionLabel>
                        <div className='flex items-start gap-2 rounded-sm border border-line bg-surface-overlay px-4 py-3 max-w-md'>
                            <p className='text-sm leading-relaxed text-surface-muted'>
                                {meaning(word.note)}
                            </p>
                            {copyButton('note', meaning(word.note), copiedKey, copyText)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
