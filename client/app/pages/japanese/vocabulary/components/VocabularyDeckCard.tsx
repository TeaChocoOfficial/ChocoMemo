// -Path: 'client/app/pages/japanese/vocabulary/components/VocabularyDeckCard.tsx'
import { motion } from 'framer-motion';
import { Link } from '~/i18n/routing';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa6';
import { StrengthMeter, WashiTape } from '~/components/custom/TastingNotes';
import { deckWordCount } from '~/stores/deck.store';
import { useLangText } from '~/hooks/useLangText';
import type { DeckData, DeckSource } from '~/types/deck';

const SOURCE_KEY: Record<DeckSource, string> = {
    default: 'japanese.decks.source.default',
    cloud: 'japanese.decks.source.cloud',
    local: 'japanese.decks.source.local',
};

const SOURCE_TAPE: Record<DeckSource, `#${string}`> = {
    default: '#e8c47a',
    cloud: '#9ec8e0',
    local: '#b8d8af',
};

const FULL_STRENGTH_WORDS = 50;

/** Vocabulary's deck card. Points at the word browser rather than Review, and
 *  shows a plain word count instead of a due-date seal. */
export default function VocabularyDeckCard({
    deck,
    index = 0,
}: {
    deck: DeckData;
    index?: number;
}) {
    const { t } = useTranslation();
    const locale = useLangText();
    const count = deckWordCount(deck);
    const fillPct = Math.min(100, (count / FULL_STRENGTH_WORDS) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className='h-full'
        >
            <Link
                to={`/japanese/vocabulary/${deck.id}`}
                className='group flex h-full flex-col rounded-[3px] border border-line-strong bg-surface-elevated px-6 pb-6 pt-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_16px_32px_-20px_rgba(0,0,0,0.4)]'
            >
                <WashiTape label={t(SOURCE_KEY[deck.source])} tone={SOURCE_TAPE[deck.source]} />

                <h3 className='font-sans text-xl font-bold leading-snug tracking-tight text-surface-foreground'>
                    {locale(deck.name)}
                </h3>
                {deck.description && (
                    <p className='mt-2 flex-1 text-sm leading-relaxed text-surface-subtle'>
                        {locale(deck.description)}
                    </p>
                )}

                <div className='mt-5'>
                    <StrengthMeter
                        value={`${count} ${t('japanese.vocabulary.words')}`}
                        fillPct={fillPct}
                    />
                </div>

                <span className='mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 group-hover:underline'>
                    {t('japanese.vocabulary.read')}
                    <FaArrowRight className='h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1' />
                </span>
            </Link>
        </motion.div>
    );
}
