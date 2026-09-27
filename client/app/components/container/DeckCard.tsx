// -Path: 'client/app/pages/japanese/review/components/DeckCard.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLangText } from '~/hooks/useLangText';
import { WashiTape } from '../custom/TastingNotes';
import type { DeckData, DeckSource } from '~/types/deck';
import { FaArrowRight, FaDownload, FaTrash } from 'react-icons/fa6';

const sourceLabel: Record<DeckSource, string> = {
    local: 'japanese.decks.source.local',
    cloud: 'japanese.decks.source.cloud',
    default: 'japanese.decks.source.default',
};

const sourceTone: Record<DeckSource, `#${string}`> = {
    cloud: '#9ec8e0',
    local: '#b8d8af',
    default: '#e8c47a',
};

export default function DeckCard({
    to,
    deck,
    index,
    content,
    onExport,
    onDelete,
    onDownload,
}: {
    to: string;
    deck: DeckData;
    index: number;
    onExport: () => void;
    onDelete: () => void;
    onDownload: () => void;
    content?: React.ReactNode;
}) {
    const locale = useLangText();
    const { t } = useTranslation();

    return (
        <motion.div
            className='h-full'
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
        >
            <div className='relative flex h-full flex-col rounded-[3px] border border-line-strong bg-surface-elevated px-6 pb-6 pt-8 transition-shadow duration-200 hover:shadow-[0_16px_32px_-20px_rgba(0,0,0,0.4)]'>
                <WashiTape label={t(sourceLabel[deck.source])} tone={sourceTone[deck.source]} />

                <div className='flex items-start justify-between gap-4'>
                    <div className='min-w-0 flex-1'>
                        <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-surface-muted'>
                            {t('japanese.decks.note')}
                        </p>
                        <h3 className='mt-1 font-sans text-xl font-bold leading-snug tracking-tight text-surface-foreground'>
                            {locale(deck.name)}
                        </h3>
                    </div>
                    <div className='flex shrink-0 gap-1'>
                        {onDownload && deck.source !== 'local' && (
                            <button
                                type='button'
                                onClick={onDownload}
                                aria-label={t('japanese.exams.card.exportAria')}
                                title={t('japanese.exams.card.export')}
                                className='inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-primary'
                            >
                                <FaDownload className='h-4 w-4' />
                            </button>
                        )}
                        {onExport && (
                            <button
                                type='button'
                                onClick={onExport}
                                aria-label={t('japanese.exams.card.exportAria')}
                                title={t('japanese.exams.card.export')}
                                className='inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-primary'
                            >
                                <FaDownload className='h-4 w-4' />
                            </button>
                        )}
                        {deck.source !== 'default' && onDelete && (
                            <button
                                type='button'
                                onClick={onDelete}
                                aria-label={t('japanese.exams.card.deleteAria')}
                                title={t('japanese.exams.card.delete')}
                                className='inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-error'
                            >
                                <FaTrash className='h-4 w-4' />
                            </button>
                        )}
                    </div>
                </div>

                {deck.description ? (
                    <p className='mt-2 flex-1 text-sm leading-relaxed text-surface-subtle'>
                        {locale(deck.description)}
                    </p>
                ) : deck.source === 'local' && deck.meta?.author ? (
                    <p className='mt-2 flex-1 text-sm leading-relaxed text-surface-subtle'>
                        {t('japanese.decks.byAuthor', { author: deck.meta.author })}
                    </p>
                ) : (
                    <p className='mt-2 flex-1' />
                )}

                <div className='mt-5'>{content}</div>

                <div className='mt-6 flex flex-1 items-end justify-between gap-3'>
                    {deck.meta?.author ? (
                        <span className='font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                            {t('japanese.exams.card.byAuthor', { author: deck.meta.author })}
                        </span>
                    ) : (
                        <span className='font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                            {t(sourceLabel[deck.source])}
                        </span>
                    )}
                    <Link
                        to={`${to}${deck.id}`}
                        className='group/link inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline'
                    >
                        {t('japanese.decks.startReview')}
                        <FaArrowRight className='h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1' />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
