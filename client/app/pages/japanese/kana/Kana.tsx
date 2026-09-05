// -Path: 'client/app/pages/japanese/kana/Kana.tsx'
import { useState } from 'react';
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import KanaGrid from './components/KanaGrid';
import { FaArrowLeft } from 'react-icons/fa6';
import Badge from '~/components/custom/Badge';
import { useTranslation } from 'react-i18next';
import { KANA_CHARS } from '~/data/japanese/kana';
import VoicePicker from '../../../components/config/VoicePicker';
import type { KanaChars, KanaSetId } from '~/data/japanese/kana';
import SetTabs, { type SetTabOption } from '~/components/custom/SetTabs';

interface GroupConfig {
    key: keyof KanaChars;
    label: string;
    columns: number;
}

export default function KanaPage() {
    const { t } = useTranslation();
    const [activeSet, setActiveSet] = useState<KanaSetId>('hiragana');

    const options = [
        { id: 'hiragana', label: t('japanese.kana.tabs.hiragana') },
        { id: 'katakana', label: t('japanese.kana.tabs.katakana') },
    ] satisfies SetTabOption[];

    const kanaChars = KANA_CHARS[activeSet];

    const groups: GroupConfig[] = [
        { key: 'voiceless', label: t('japanese.kana.voiceless'), columns: 5 },
        { key: 'voiced', label: t('japanese.kana.voiced'), columns: 5 },
        { key: 'contracted', label: t('japanese.kana.contracted'), columns: 3 },
    ];

    return (
        <section className='relative min-h-screen overflow-hidden py-16 sm:py-20'>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.kana.back_hub')}
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='text-center mb-10'
                >
                    <Badge variant='info' className='mb-6'>
                        {t('japanese.kana.badge')}
                    </Badge>
                    <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                        {t('japanese.kana.title')}
                    </h1>
                    <p className='max-w-2xl mx-auto text-lg text-surface-subtle leading-relaxed'>
                        {t('japanese.kana.description')}
                    </p>
                </motion.div>

                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8'>
                    <SetTabs
                        options={options}
                        active={activeSet}
                        onChange={(option) => setActiveSet(option.id as KanaSetId)}
                    />
                    <VoicePicker />
                </div>

                {groups.map((group) => (
                    <div key={group.key} className='mb-10'>
                        <h2 className='mb-4 text-lg font-bold text-surface-foreground'>
                            {group.label}
                        </h2>
                        <KanaGrid kanaList={kanaChars[group.key]} columns={group.columns} />
                    </div>
                ))}
            </div>
        </section>
    );
}
