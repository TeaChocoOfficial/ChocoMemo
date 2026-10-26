import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { Languages } from '~/data/language';
import Badge from '~/components/custom/Badge';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import CharactersStats from './CharactersStats';
import ChacterToolbar from './CharacterToolbar';
import Section from '~/components/custom/Section';
import SectionHeading from '~/components/custom/SectionHeading';
import { useCharacterToolbar } from '~/hooks/characters/useCharacterToolbar';

export default function CharactersPage({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    const { lang, options, activeSet, activeGroup } = useCharacterToolbar();
    const activeGroupId = options.groupId.find((group) => group === activeGroup);
    const language = Languages[lang];

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

                <CharactersStats />

                <ChacterToolbar />

                <SectionHeading
                    hint={t(`${language}.character.gridHint`)}
                    step={t(`${language}.character.tabs.${activeSet}`)}
                    label={t(`${language}.character.tabs.${activeGroupId}`)}
                />

                {children}
            </div>
        </Section>
    );
}
