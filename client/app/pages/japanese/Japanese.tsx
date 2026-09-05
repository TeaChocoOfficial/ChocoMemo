// -Path: 'client/app/pages/japanese/Japanese.tsx'
import { motion } from 'framer-motion';
import { Link } from '~/i18n/routing';
import JapaneseHero from './JapaneseHero';
import JapaneseNavCard, { type JapaneseNavItem } from './JapaneseNavCard';
import { FaArrowLeft, FaArrowsRotate, FaBolt } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { KANA_CHARS } from '~/data/japanese/kana';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { useVocabularyStore } from '~/stores/vocabulary.store';
import { useVocabProgressStore } from '~/stores/vocabProgress.store';
import Section from '~/components/custom/Section';

function SectionHeading({ step, label, hint }: { step: string; label: string; hint: string }) {
    return (
        <div className='mb-6'>
            <div className='flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>{step}</span>
                <span className='h-px w-10 bg-line-strong' />
                <h2 className='text-xl sm:text-2xl font-bold tracking-tight text-surface-foreground'>
                    {label}
                </h2>
            </div>
            <p className='mt-2 text-sm leading-relaxed text-surface-muted'>{hint}</p>
        </div>
    );
}

export default function JapanesePage() {
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

    const kanaItems: JapaneseNavItem[] = [
        {
            to: '/japanese/kana',
            mode: 'learn',
            title: t('japanese.nav.kana.title'),
            description: t('japanese.nav.kana.description'),
            action: t('japanese.nav.kana.action'),
            icon: <span className='text-2xl leading-none font-black'>あ</span>,
        },
        {
            to: '/japanese/kana-drill',
            mode: 'practice',
            title: t('japanese.nav.kanaDrill.title'),
            description: t('japanese.nav.kanaDrill.description'),
            action: t('japanese.nav.kanaDrill.action'),
            icon: <FaBolt className='w-5 h-5' />,
        },
    ];

    const vocabItems: JapaneseNavItem[] = [
        {
            to: '/japanese/vocabulary',
            mode: 'learn',
            title: t('japanese.nav.vocabulary.title'),
            description: t('japanese.nav.vocabulary.description'),
            action: t('japanese.nav.vocabulary.action'),
            icon: <span className='text-2xl leading-none font-black'>語</span>,
        },
        {
            to: '/japanese/vocabulary-review',
            mode: 'practice',
            title: t('japanese.nav.vocabularyReview.title'),
            description: t('japanese.nav.vocabularyReview.description'),
            action: t('japanese.nav.vocabularyReview.action'),
            icon: <FaArrowsRotate className='w-5 h-5' />,
        },
    ];

    return (
        <Section className='items-start justify-center'>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/language-select'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.back_language')}
                </Link>

                <JapaneseHero />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='grid grid-cols-2 gap-4 md:grid-cols-4 mb-14'
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className='rounded-sm border border-line bg-surface-overlay px-5 py-4'
                        >
                            <p className='text-2xl sm:text-3xl font-black tracking-tight text-surface-foreground'>
                                {stat.value}
                            </p>
                            <p className='mt-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>

                <div className='mb-12'>
                    <SectionHeading
                        step='01'
                        label={t('japanese.sections.kana')}
                        hint={t('japanese.sections.kanaHint')}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {kanaItems.map((item, index) => (
                            <JapaneseNavCard key={item.to} item={item} index={index} />
                        ))}
                    </div>
                </div>

                <div>
                    <SectionHeading
                        step='02'
                        label={t('japanese.sections.vocabulary')}
                        hint={t('japanese.sections.vocabularyHint')}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {vocabItems.map((item, index) => (
                            <JapaneseNavCard key={item.to} item={item} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}