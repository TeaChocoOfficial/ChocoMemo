// -Path: 'client/app/components/container/DeckCard.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLangText } from '~/hooks/useLangText';
import type { DeckData, DeckSource, DeckType } from '~/types/deck';
import { FaArrowRight, FaDownload, FaFileExport, FaTrash } from 'react-icons/fa6';

const SOURCE_KEY: Record<DeckSource, string> = {
    default: 'deck.source.default',
    local: 'deck.source.local',
    cloud: 'deck.source.cloud',
};

/** The card's kicker. Read from `deck.type` rather than from the list it
 *  happens to appear in, so a vocabulary deck never claims to be a review. */
const TYPE_KEY: Record<DeckType, string> = {
    vocab: 'deck.type.vocab',
    render: 'deck.type.render',
    review: 'deck.type.review',
    exam: 'deck.type.exam',
    drill: 'deck.type.drill',
};

export default function DeckCard({
    to,
    deck,
    index,
    onExport,
    onDelete,
    onDownload,
}: {
    /** Base path the card links into; the deck id is appended. */
    to: string;
    deck: DeckData;
    index: number;
    /** Offered on locally-owned decks. */
    onExport?: () => void;
    /** Offered on anything the user can remove, i.e. not built-in. */
    onDelete?: () => void;
    /** Only meaningful for cloud decks, which are fetched rather than owned. */
    onDownload?: () => void;
}) {
    const locale = useLangText();
    const { t } = useTranslation();

    const isOwned = deck.source !== 'default';
    const author = deck.meta?.author;

    /** Stops the click reaching the card's own Link, which would navigate
     *  away while the action runs. */
    const runAction = (e: React.MouseEvent, action?: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action?.();
    };

    return (
        <motion.div
            className='h-full'
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <div className='relative h-full rounded-[3px] border border-line-strong bg-surface-elevated transition-shadow duration-200 hover:shadow-[0_16px_32px_-20px_rgba(0,0,0,0.4)]'>
                <Link
                    to={`${to}${deck.id}`}
                    className='flex h-full flex-col px-6 py-6 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2'
                >
                    <p className='font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary'>
                        {t(TYPE_KEY[deck.type])}
                    </p>
                    <h3 className='mt-1.5 font-sans text-xl font-bold leading-snug tracking-tight text-surface-foreground'>
                        {locale(deck.name)}
                    </h3>
                    <p className='mt-2 flex-1 text-sm leading-relaxed text-surface-subtle'>
                        {deck.description
                            ? locale(deck.description)
                            : (author?.nameTag ?? t(SOURCE_KEY[deck.source]))}
                    </p>

                    <div className='mt-5 flex items-end justify-between gap-3'>
                        <span className='font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                            {t('deck.itemCount', { count: deck.contentIds.length })}
                        </span>
                        <span className='group/link inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4'>
                            {t('deck.open')}
                            <FaArrowRight className='h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1' />
                        </span>
                    </div>
                </Link>

                {(onExport || onDelete || onDownload) && (
                    // Outside the Link: nesting a button inside an anchor is
                    // invalid HTML and breaks keyboard navigation.
                    <div className='flex items-center gap-1 border-t border-line px-4 py-2'>
                        {onExport && deck.source === 'local' && (
                            <button
                                type='button'
                                title={t('deck.export')}
                                aria-label={t('deck.exportAria')}
                                onClick={(e) => runAction(e, onExport)}
                                className='inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-primary'
                            >
                                <FaFileExport className='h-3.5 w-3.5' />
                            </button>
                        )}
                        {onDownload && deck.source === 'cloud' && (
                            <button
                                type='button'
                                title={t('deck.download')}
                                aria-label={t('deck.downloadAria')}
                                onClick={(e) => runAction(e, onDownload)}
                                className='inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-primary'
                            >
                                <FaDownload className='h-3.5 w-3.5' />
                            </button>
                        )}
                        {onDelete && isOwned && (
                            <button
                                type='button'
                                title={t('decks.delete')}
                                aria-label={t('deck.deleteAria')}
                                onClick={(e) => runAction(e, onDelete)}
                                className='inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm text-surface-muted transition-colors hover:bg-surface-overlay hover:text-error'
                            >
                                <FaTrash className='h-3.5 w-3.5' />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
