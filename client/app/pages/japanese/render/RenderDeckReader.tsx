// -Path: 'client/app/pages/japanese/render/RenderDeckReader.tsx'
import { useState } from 'react';
import { Languages } from '~/data/language';
import { Link } from '~/i18n/routing';
import { useParams as useRouterParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaVolumeHigh } from 'react-icons/fa6';
import Section from '~/components/custom/Section';
import Button from '~/components/custom/Button';
import { useLangText } from '~/hooks/useLangText';
import { useSpeak } from '~/hooks/useSpeak';
import { deckPassages, localDecksOfType } from '~/stores/deck/deckListLocal.store';

/** Renders one line of a passage. Kanji carry their own `rt`, so each gets its
 *  own furigana rather than a single reading spread across the run. */
function PassageLine({ segments }: { segments: { ch: string; rt?: string }[] }) {
    return (
        <p className='text-lg leading-loose text-surface-foreground'>
            {segments.map((segment, i) => (
                <span key={i} className='inline-block'>
                    {segment.rt ? (
                        <ruby>
                            {segment.ch}
                            <rp>(</rp>
                            <rt className='text-[0.55em] text-surface-muted'>{segment.rt}</rt>
                            <rp>)</rp>
                        </ruby>
                    ) : (
                        segment.ch
                    )}
                </span>
            ))}
        </p>
    );
}

function Passage({
    title,
    note,
    lines,
    translation,
}: {
    title: string;
    note?: string;
    lines: { segments: { ch: string; rt?: string }[] }[];
    translation: string;
}) {
    const { t } = useTranslation();
    const speak = useSpeak();
    // Translation is hidden until asked for, so the first read is unaided.
    const [showTranslation, setShowTranslation] = useState(false);
    const readable = lines.map((l) => l.segments.map((s) => s.ch).join('')).join(' ');

    return (
        <article className='rounded-sm border border-line bg-surface p-5 sm:p-7'>
            <div className='mb-4 flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                    <h2 className='text-lg font-bold tracking-tight text-surface-foreground'>
                        {title}
                    </h2>
                    {note && <p className='mt-1 text-sm text-surface-muted'>{note}</p>}
                </div>
                <button
                    type='button'
                    onClick={() => speak(readable)}
                    aria-label={t('japanese.render.speak')}
                    title={t('japanese.render.speak')}
                    className='inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-primary'
                >
                    <FaVolumeHigh className='h-4 w-4' />
                </button>
            </div>

            <div className='space-y-3'>
                {lines.map((line, i) => (
                    <PassageLine key={i} segments={line.segments} />
                ))}
            </div>

            <div className='mt-6 border-t border-line pt-4'>
                <Button size='sm' variant='ghost' onClick={() => setShowTranslation((v) => !v)}>
                    {showTranslation
                        ? t('japanese.render.hideTranslation')
                        : t('japanese.render.showTranslation')}
                </Button>
                {showTranslation && (
                    <p className='mt-2 text-sm leading-relaxed text-surface-muted'>{translation}</p>
                )}
            </div>
        </article>
    );
}

/** Reads a render deck's passages one after another. */
export default function RenderDeckReader() {
    const { t } = useTranslation();
    const locale = useLangText();
    const { deckId = '' } = useRouterParams();

    const deck = localDecksOfType(Languages.ja, 'render').find((d) => d.id === deckId);
    const passages = deck ? deckPassages(deck) : [];

    return (
        <Section className='items-start justify-center'>
            <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese/render'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.render.back_hub')}
                </Link>

                {deck && (
                    <h1 className='mb-8 text-2xl font-black tracking-tight text-surface-foreground sm:text-3xl'>
                        {locale(deck.name)}
                    </h1>
                )}

                <div className='space-y-5'>
                    {passages.map((passage) => (
                        <Passage
                            key={passage.id}
                            title={passage.title}
                            note={passage.note ? locale(passage.note) : undefined}
                            lines={passage.lines}
                            translation={locale(passage.translation)}
                        />
                    ))}
                </div>

                {passages.length === 0 && (
                    <p className='py-16 text-center text-sm text-surface-muted'>
                        {t('japanese.render.empty')}
                    </p>
                )}
            </div>
        </Section>
    );
}
