import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { Languages } from '~/data/language';
import Badge from '~/components/custom/Badge';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import ChacterToolbar from './CharacterToolbar';
import Section from '~/components/custom/Section';
import type { CharLang } from '~/types/characters';
import SectionHeading from '~/components/custom/SectionHeading';
import { useCharacterToolbar } from '~/hooks/characters/useChacterToolbar';
import type { CharacterReader } from '~/hooks/characters/useCharacterReader';

/** One figure in the three-up stats row under the hero. */
export interface Stat {
    label: string;
    value: string;
}

export default function CharactersPage<Lang extends CharLang>({
    lang,
    children,
    characterReader,
}: {
    lang: Lang;
    children: React.ReactNode;
    characterReader: CharacterReader<Lang>;
}) {
    const { t } = useTranslation();
    const language = Languages[lang];
    const { activeSet, activeGroup, items, options } = useCharacterToolbar(lang);
    const activeGroupId = options.groupId.find((group) => group === activeGroup);
    const { readSoFar, groupTotal } = characterReader;

    const stats: Stat[] = [
        { label: t(`${language}.character.stats.set`), value: items.length.toLocaleString() },
        { label: t(`${language}.character.stats.group`), value: groupTotal.toLocaleString() },
        {
            label: t(`${language}.character.stats.read`),
            value: t(`${language}.character.readProgress`, { read: readSoFar, total: groupTotal }),
        },
    ];

    return (
        <Section>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/study'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('deck.list.backStudy')}
                </Link>

                <motion.div
                    className='text-center mb-8'
                    transition={{ duration: 0.8 }}
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 50 }}
                >
                    <Badge variant='info' className='mb-6'>
                        {t(`${language}.character.badge`)}
                    </Badge>
                    <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                        {t(`${language}.character.title`)}
                    </h1>
                    <p className='max-w-2xl mx-auto text-lg text-surface-subtle leading-relaxed'>
                        {t(`${language}.character.description`)}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className='grid grid-cols-3 gap-4 mb-6'
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

                <ChacterToolbar lang={lang} characterReader={characterReader} />

                <SectionHeading
                    hint={t(`${language}.character.gridHint`)}
                    step={t(`${language}.character.tabs.${activeSet}`)}
                    label={t(`${language}.character.group.${activeGroupId}`)}
                />

                {children}
            </div>
        </Section>
    );
}
