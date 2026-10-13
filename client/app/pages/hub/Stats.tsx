import { useTranslation } from 'react-i18next';
import { KANA_CHARS } from '~/data/japanese/kana';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { useVocabularyStore } from '~/stores/japanese/vocabulary.store';
import { useVocabProgressStore } from '~/stores/japanese/vocabProgress.store';

export default function Stats() {
    const { t } = useTranslation();
    const { custom } = useVocabularyStore();
    const { progress } = useVocabProgressStore();

    const totalKana = Object.values(KANA_CHARS).reduce(
        (sum, set) => sum + Object.values(set).reduce((s, group) => s + group.length, 0),
        0,
    );
    const vocabCount = DEFAULT_VOCABULARY.length + custom.length;
    const learnedCount = Object.values(progress).filter((p) => p.reviewCount > 0).length;
    const dueCount = Object.values(progress).filter((p) => p.dueAt <= Date.now()).length;

    const stats = [
        { label: t('japanese.stats.kana'), value: totalKana.toLocaleString() },
        { label: t('japanese.stats.vocabulary'), value: vocabCount.toLocaleString() },
        { label: t('japanese.stats.learned'), value: learnedCount.toLocaleString() },
        { label: t('japanese.stats.due'), value: dueCount.toLocaleString() },
    ];

    return (
        <div className='mb-12 grid grid-cols-2 gap-4 md:grid-cols-4'>
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className='rounded-sm border border-line bg-surface-overlay px-5 py-4'
                >
                    <p className='text-2xl font-black tracking-tight text-surface-foreground sm:text-3xl'>
                        {stat.value}
                    </p>
                    <p className='mt-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    );
}
