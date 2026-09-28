import { useState } from 'react';
import { useSpeak } from '~/hooks/useSpeak';
import { useLangText } from '~/hooks/useLangText';
import type { VocabWord } from '~/types/vocabulary';
import { FaCheck, FaCopy, FaVolumeHigh } from 'react-icons/fa6';

function TipBody({
    label,
    extra,
    reading,
    copyText,
    onSpeak,
}: {
    label: string;
    extra?: string;
    reading?: string;
    copyText: string;
    onSpeak: () => void;
}) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        void navigator.clipboard.writeText(copyText);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
    };

    return (
        <span className='pointer-events-none absolute bottom-full left-1/2 z-50 -translate-x-1/2 flex flex-col items-center opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100'>
            <span className='whitespace-nowrap rounded-sm border border-line bg-surface-elevated px-3 py-2 text-xs'>
                <span className='inline-flex items-center gap-2'>
                    <span className='font-bold text-surface-foreground'>{label}</span>
                    {reading && <span className='text-surface-muted'>{reading}</span>}
                    <button
                        type='button'
                        onClick={onSpeak}
                        aria-label='Read aloud'
                        className='inline-flex w-5 h-5 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary-emphasis cursor-pointer'
                    >
                        <FaVolumeHigh className='w-2.5 h-2.5' />
                    </button>
                    <button
                        type='button'
                        onClick={copy}
                        aria-label={copied ? 'Copied' : 'Copy'}
                        title={copied ? 'Copied' : 'Copy'}
                        className='inline-flex w-5 h-5 items-center justify-center rounded-full bg-surface-muted/20 text-surface-foreground hover:bg-surface-muted/40 cursor-pointer'
                    >
                        {copied ? (
                            <FaCheck className='w-2.5 h-2.5' />
                        ) : (
                            <FaCopy className='w-2.5 h-2.5' />
                        )}
                    </button>
                </span>
                {extra && <span className='mt-1 block text-surface-muted'>{extra}</span>}
            </span>
            <span className='h-2 w-full' />
        </span>
    );
}

export default function VocabTip({
    word,
    children,
}: {
    word: VocabWord;
    children: React.ReactNode;
}) {
    const speak = useSpeak();
    const meaning = useLangText();
    const localized = meaning(word.meaning);

    return (
        <span className='group relative inline-flex items-end'>
            {children}
            <TipBody
                label={word.word}
                reading={`· ${word.reading}`}
                extra={localized}
                copyText={[word.word, word.reading, localized].filter(Boolean).join(' · ')}
                onSpeak={() => speak(word.word, word.audioWordUrl)}
            />
        </span>
    );
}
