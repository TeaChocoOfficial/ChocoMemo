import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useKanaProgressStore } from '~/stores/kanaProgress.store';
import { useVocabProgressStore } from '~/stores/vocabProgress.store';
import { useVocabularyStore } from '~/stores/vocabulary.store';

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className='rounded-sm border border-line bg-surface p-4 sm:p-5'
        >
            <div className='font-mono text-2xl font-black tabular-nums text-primary sm:text-3xl'>
                {value.toLocaleString()}
            </div>
            <div className='mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                {label}
            </div>
        </motion.div>
    );
}

/** Learning-progress stats grid (kana read, vocabulary size, words learned, due for review). */
export default function StatsSection() {
    const { t } = useTranslation();
    const kanaProgress = useKanaProgressStore((s) => s.progress);
    const vocabProgress = useVocabProgressStore((s) => s.progress);
    const totalVocabulary = useVocabularyStore((s) => s.all().length);

    const kanaRead = Object.keys(kanaProgress).length;
    const wordsLearned = Object.values(vocabProgress).filter((p) => p.reviewCount > 0).length;
    const dueForReview = Object.values(vocabProgress).filter(
        (p) => p.dueAt > 0 && p.dueAt <= Date.now(),
    ).length;

    return (
        <section>
            <div className='mb-5 flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-primary'>
                    02
                </span>
                <span className='h-px w-10 bg-line-strong' />
                <h2 className='text-lg font-bold tracking-tight text-surface-foreground sm:text-xl'>
                    {t('profile.stats.label')}
                </h2>
            </div>
            <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
                <Stat label={t('profile.stats.kana')} value={kanaRead} />
                <Stat label={t('profile.stats.vocabulary')} value={totalVocabulary} />
                <Stat label={t('profile.stats.learned')} value={wordsLearned} />
                <Stat label={t('profile.stats.due')} value={dueForReview} />
            </div>
        </section>
    );
}
