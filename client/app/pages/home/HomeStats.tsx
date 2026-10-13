// -Path: 'client/app/pages/home/HomeStats.tsx'
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import { KANA_CHARS } from '~/data/japanese/kana';
import { DEFAULT_VOCABULARY } from '~/data/japanese/vocabulary';
import { Languages, languages } from '~/data/language';
import { officialDecks } from '~/stores/deck/deckListOfficial.store';

/**
 * The opening figures: a hairline-ruled strip of counts measured from the data
 * the app actually loads — bundled decks, vocabulary, kana, and the languages
 * that are ready. Nothing is typed into copy, so the numbers cannot drift.
 *
 * A "users" figure is deliberately absent: the app has no server endpoint that
 * reports a user or community count, and a made-up number would be a lie.
 */
export default function HomeStats() {
    const { t } = useTranslation();

    const characters = Object.values(KANA_CHARS).reduce(
        (sum, set) => sum + Object.values(set).reduce((group, list) => group + list.length, 0),
        0,
    );
    const readyLanguages = languages.filter(
        (language) => language.status === 'ready' && language.id !== Languages.other,
    ).length;

    const stats = [
        { value: officialDecks(Languages.ja).length, label: t('home.stats.shelves') },
        { value: DEFAULT_VOCABULARY.length, label: t('home.stats.vocabulary') },
        { value: characters, label: t('home.stats.kana') },
        { value: readyLanguages, label: t('home.stats.languages') },
    ];

    return (
        <Section className='items-center'>
            <div className='mx-auto w-full max-w-5xl px-4 sm:px-6'>
                <div className='flex items-center gap-3 border-t border-line pt-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary'>
                    <span className='tabular-nums'>01</span>
                    <span aria-hidden='true' className='h-px w-6 bg-line-strong' />
                    <span>{t('home.stats.badge')}</span>
                </div>

                <dl className='mt-6 grid grid-cols-2 divide-x divide-y divide-line border-y border-line sm:grid-cols-4 sm:divide-y-0'>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ margin: '-100px' }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            className='px-5 py-7'
                        >
                            <dd className='text-4xl font-black tracking-tight text-primary sm:text-5xl'>
                                {stat.value.toLocaleString()}
                            </dd>
                            <dt className='mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                                {stat.label}
                            </dt>
                        </motion.div>
                    ))}
                </dl>
            </div>
        </Section>
    );
}
