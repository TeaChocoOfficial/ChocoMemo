import { FaArrowLeft, FaBoxOpen, FaDownload, FaArrowRight } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import Section from '~/components/custom/Section';
import Badge from '~/components/custom/Badge';
import { useLangText } from '~/hooks/useLangText';
import { allDecks, deckWords } from '~/stores/deck.store';
import { useVocabProgressStore } from '~/stores/vocabProgress.store';
import { useVocabularyStore } from '~/stores/vocabulary.store';
import type { DeckSource, VocabDeck } from '~/types/vocabulary';

const sourceBadge: Record<DeckSource, string> = {
    default: 'info',
    custom: 'success',
    cloud: 'warning',
    downloaded: 'neutral',
};

const sourceLabel: Record<DeckSource, string> = {
    default: 'japanese.decks.source.default',
    custom: 'japanese.decks.source.custom',
    cloud: 'japanese.decks.source.cloud',
    downloaded: 'japanese.decks.source.downloaded',
};

function DeckCard({ deck, index }: { deck: VocabDeck; index: number }) {
    const { t } = useTranslation();
    const locale = useLangText();
    const { progress } = useVocabProgressStore();
    const words = deckWords(deck);
    const due = words.filter((w) => (progress[w.id]?.dueAt ?? 0) <= Date.now()).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className='h-full'
        >
            <Link
                to={`/japanese/review/${deck.id}`}
                className='group relative flex h-full flex-col rounded-sm border border-line bg-surface p-6 transition-colors duration-200 hover:border-accent hover:bg-surface-overlay'
            >
                <div className='mb-4 flex items-start justify-between gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-sm bg-accent text-accent-foreground transition-colors duration-200 group-hover:bg-accent-emphasis'>
                        <FaBoxOpen className='w-5 h-5' />
                    </div>
                    <span className='font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                        {t(sourceLabel[deck.source])}
                    </span>
                </div>

                <h3 className='mb-2 pr-14 text-lg font-bold tracking-tight text-surface-foreground'>
                    {locale(deck.name)}
                </h3>
                {deck.description && (
                    <p className='flex-1 text-sm leading-relaxed text-surface-muted'>
                        {locale(deck.description)}
                    </p>
                )}
                {!deck.description && deck.source === 'downloaded' && deck.meta?.author && (
                    <p className='flex-1 text-sm leading-relaxed text-surface-muted'>
                        {t('japanese.decks.byAuthor', { author: deck.meta.author })}
                    </p>
                )}

                <div className='mt-6 flex items-center justify-between'>
                    <span className='font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted tabular-nums'>
                        {words.length} · {due} {t('japanese.decks.due')}
                    </span>
                    <span className='inline-flex items-center gap-2 text-sm font-semibold text-accent'>
                        {t('japanese.decks.startReview')}
                        <FaArrowRight className='w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1' />
                    </span>
                </div>

                {deck.source === 'downloaded' && (
                    <button
                        type='button'
                        onClick={(e) => e.preventDefault()}
                        className='absolute right-5 bottom-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-surface-muted transition-colors hover:text-accent'
                    >
                        <FaDownload className='w-3 h-3' />
                        {t('japanese.decks.download')}
                    </button>
                )}
            </Link>
        </motion.div>
    );
}

export default function DeckListPage() {
    const { t } = useTranslation();
    const { custom } = useVocabularyStore();
    const decks = allDecks();

    return (
        <Section>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.vocabularyReview.back_hub')}
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='text-center mb-10'
                >
                    <Badge variant='info' className='mb-6'>
                        {t('japanese.vocabularyReview.badge')}
                    </Badge>
                    <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                        {t('japanese.decks.title')}
                    </h1>
                    <p className='max-w-2xl mx-auto text-lg text-surface-subtle leading-relaxed'>
                        {t('japanese.decks.description')}
                    </p>
                </motion.div>

                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8'>
                    <p className='text-sm text-surface-muted'>
                        {t('japanese.decks.availableCount', { count: decks.length })} ·{' '}
                        {custom.length} {t('japanese.vocabulary.available', { count: custom.length })}
                    </p>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {decks.map((deck, index) => (
                        <DeckCard key={deck.id} deck={deck} index={index} />
                    ))}
                </div>
            </div>
        </Section>
    );
}