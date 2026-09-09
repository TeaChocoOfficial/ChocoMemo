// -Path: 'client/app/pages/home/HomeStats.tsx'
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import { KANA_CHARS } from '~/data/japanese/kana';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { THEMES } from '~/stores/theme.store';

function StatTile({
    value,
    label,
    index,
}: {
    value: string;
    label: string;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className='rounded-sm border border-line bg-surface px-5 py-6 text-center'
        >
            <p className='text-4xl sm:text-5xl font-black tracking-tight text-accent'>{value}</p>
            <p className='mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                {label}
            </p>
        </motion.div>
    );
}

export default function HomeStats() {
    const { t } = useTranslation();

    const totalKana = Object.values(KANA_CHARS).reduce(
        (sum, set) => sum + Object.values(set).reduce((s, group) => s + group.length, 0),
        0,
    );

    const stats = [
        { value: totalKana.toLocaleString(), label: t('home.stats.kana') },
        { value: DEFAULT_VOCABULARY.length.toLocaleString(), label: t('home.stats.vocabulary') },
        { value: '3', label: t('home.stats.modes') },
        { value: THEMES.length.toLocaleString(), label: t('home.stats.themes') },
    ];

    return (
        <Section className='items-center'>
            <div className='mx-auto w-full max-w-5xl px-4 sm:px-6'>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                    className='mb-8 flex items-center gap-3'
                >
                    <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>
                        {t('home.stats.badge')}
                    </span>
                    <span className='h-px w-10 bg-line-strong' />
                </motion.div>

                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                    {stats.map((stat, index) => (
                        <StatTile key={stat.label} value={stat.value} label={stat.label} index={index} />
                    ))}
                </div>
            </div>
        </Section>
    );
}