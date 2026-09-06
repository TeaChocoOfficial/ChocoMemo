// -Path: 'client/app/pages/japanese/review/components/DeckCard.tsx'
import { motion } from 'framer-motion';
import { FaArrowRight, FaDownload } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { useLangText } from '~/hooks/useLangText';
import { deckWords } from '~/stores/deck.store';
import { useVocabProgressStore } from '~/stores/vocabProgress.store';
import { DueSeal, StrengthMeter, WashiTape } from '~/components/custom/TastingNotes';
import type { DeckSource, VocabDeck } from '~/types/vocabulary';

const sourceLabel: Record<DeckSource, string> = {
    default: 'japanese.decks.source.default',
    custom: 'japanese.decks.source.custom',
    cloud: 'japanese.decks.source.cloud',
    downloaded: 'japanese.decks.source.downloaded',
};

const sourceTone: Record<DeckSource, `#${string}`> = {
    default: '#e8c47a',
    custom: '#c9b6e4',
    cloud: '#9ec8e0',
    downloaded: '#b8d8af',
};

const FULL_STRENGTH_WORDS = 50;

export default function DeckCard({ deck, index = 0 }: { deck: VocabDeck; index?: number }) {
    const { t } = useTranslation();
    const locale = useLangText();
    const { progress } = useVocabProgressStore();
    const words = deckWords(deck);
    const due = words.filter((w) => (progress[w.id]?.dueAt ?? 0) <= Date.now()).length;
    const fillPct = Math.min(100, (words.length / FULL_STRENGTH_WORDS) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className='h-full'
        >
            <Link
                to={`/japanese/review/${deck.id}`}
                className='group relative flex h-full flex-col rounded-[3px] border border-line-strong bg-surface-elevated px-6 pb-6 pt-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-[0_16px_32px_-20px_rgba(0,0,0,0.4)]'
            >
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
                    <DueSeal
                        due={due}
                        dueLabel={t('japanese.decks.due')}
                        readyLabel={t('japanese.decks.ready')}
                    />
                </div>

                {deck.description ? (
                    <p className='mt-2 flex-1 text-sm leading-relaxed text-surface-subtle'>
                        {locale(deck.description)}
                    </p>
                ) : deck.source === 'downloaded' && deck.meta?.author ? (
                    <p className='mt-2 flex-1 text-sm leading-relaxed text-surface-subtle'>
                        {t('japanese.decks.byAuthor', { author: deck.meta.author })}
                    </p>
                ) : (
                    <p className='mt-2 flex-1' />
                )}

                <div className='mt-5'>
                    <StrengthMeter
                        value={`${words.length} ${t('japanese.decks.words')}`}
                        fillPct={fillPct}
                    />
                </div>

                <div className='mt-6 flex flex-1 items-end justify-between gap-3'>
                    {deck.source === 'downloaded' ? (
                        <button
                            type='button'
                            onClick={(e) => e.preventDefault()}
                            className='inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted transition-colors hover:text-accent'
                        >
                            <FaDownload className='h-3 w-3' />
                            {t('japanese.decks.download')}
                        </button>
                    ) : (
                        <span className='font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                            {t('japanese.decks.due')}: {due}
                        </span>
                    )}
                    <span className='group/link inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 hover:underline'>
                        {t('japanese.decks.startReview')}
                        <FaArrowRight className='h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1' />
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}