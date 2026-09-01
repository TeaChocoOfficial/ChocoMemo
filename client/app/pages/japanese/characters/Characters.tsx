// -Path: 'client/app/pages/japanese/characters/Characters.tsx'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Badge from '~/components/custom/Badge';
import { Link } from '~/i18n/routing';
import { FaArrowLeft, FaCircleRight } from 'react-icons/fa6';
import type { KanaSetId } from '~/data/japanese/kana';
import { KANA_SETS } from '~/data/japanese/kana';
import CharacterGrid from './components/CharacterGrid';
import CharacterSetTabs from './components/CharacterSetTabs';

export default function CharactersPage() {
    const { t } = useTranslation();
    const [activeSet, setActiveSet] = useState<KanaSetId>('hiragana');

    const labels: Record<KanaSetId, string> = {
        hiragana: t('japanese.characters.tabs.hiragana'),
        katakana: t('japanese.characters.tabs.katakana'),
    };

    const kanaList = KANA_SETS[activeSet];

    return (
        <section className='relative min-h-screen overflow-hidden py-16 sm:py-20'>
            <div className='absolute inset-0 -z-10'>
                <div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2' />
            </div>

            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.characters.back_hub')}
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='text-center mb-10'
                >
                    <Badge variant='info' className='mb-6'>
                        {t('japanese.characters.badge')}
                    </Badge>
                    <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                        {t('japanese.characters.title')}
                    </h1>
                    <p className='max-w-2xl mx-auto text-lg text-surface-subtle leading-relaxed'>
                        {t('japanese.characters.description')}
                    </p>
                </motion.div>

                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8'>
                    <CharacterSetTabs active={activeSet} onChange={setActiveSet} labels={labels} />
                    <Link
                        to='/japanese/characters/quiz'
                        className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all duration-300'
                    >
                        {t('japanese.characters.take_quiz')}
                        <FaCircleRight className='w-4 h-4' />
                    </Link>
                </div>

                <div className='mb-4 flex items-center justify-between text-sm text-surface-muted'>
                    <span>{kanaList.length} {t('japanese.characters.count')}</span>
                </div>

                <CharacterGrid kanaList={kanaList} />
            </div>
        </section>
    );
}
