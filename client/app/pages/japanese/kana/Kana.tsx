// -Path: 'client/app/pages/japanese/kana/Kana.tsx'
import { useState } from 'react';
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { KANA_CHARS } from '~/data/japanese/kana';
import type { Kana, KanaChars, KanaSetId } from '~/data/japanese/kana';
import SetTabs, { type SetTabOption } from '~/components/custom/SetTabs';
import Section from '~/components/custom/Section';
import { useKanaReader } from '~/hooks/useKanaReader';
import KanaGrid from './components/KanaGrid';
import KanaHero from './components/KanaHero';
import KanaStats, { type Stat } from './components/KanaStats';
import KanaToolbar from './components/KanaToolbar';
import { SectionHeading } from './components/SectionHeading';

const groupColumns: Record<keyof KanaChars, number> = {
    voiceless: 5,
    voiced: 5,
    contracted: 3,
};

export default function KanaPage() {
    const { t } = useTranslation();
    const [activeSet, setActiveSet] = useState<KanaSetId>('hiragana');
    const [activeGroup, setActiveGroup] = useState<keyof KanaChars>('voiceless');
    const [stickyEnabled, setStickyEnabled] = useState(true);

    const setOptions = [
        { id: 'hiragana', label: t('japanese.kana.tabs.hiragana') },
        { id: 'katakana', label: t('japanese.kana.tabs.katakana') },
    ] satisfies SetTabOption[];

    const groupOptions = [
        { id: 'voiceless', label: t('japanese.kana.voiceless') },
        { id: 'voiced', label: t('japanese.kana.voiced') },
        { id: 'contracted', label: t('japanese.kana.contracted') },
    ] satisfies SetTabOption[];

    const kanaChars = KANA_CHARS[activeSet];
    const activeGroupLabel = groupOptions.find((group) => group.id === activeGroup)?.label ?? '';

    const {
        isReading,
        readingChar,
        displayChar,
        readSoFar,
        groupTotal,
        isResume,
        percentRead,
        currentRomaji,
        statusLabel,
        groupList,
        startReading,
        stopReading,
        handleCardRead,
    } = useKanaReader(activeSet, activeGroup, kanaChars);

    const countGroup = (list: Kana[]) => list.filter((kana) => kana.char).length;
    const setTotal =
        countGroup(kanaChars.voiceless) +
        countGroup(kanaChars.voiced) +
        countGroup(kanaChars.contracted);

    const stats: Stat[] = [
        { label: t('japanese.kana.stats.set'), value: setTotal.toLocaleString() },
        { label: t('japanese.kana.stats.group'), value: groupTotal.toLocaleString() },
        {
            label: t('japanese.kana.stats.read'),
            value: t('japanese.kana.readProgress', { read: readSoFar, total: groupTotal }),
        },
    ];

    const handleSetChange = (option: SetTabOption) => {
        stopReading();
        setActiveSet(option.id as KanaSetId);
    };

    const handleGroupChange = (option: SetTabOption) => {
        stopReading();
        setActiveGroup(option.id as keyof KanaChars);
    };

    return (
        <Section>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.kana.back_hub')}
                </Link>

                <KanaHero />

                <KanaStats stats={stats} />

                <KanaToolbar
                    stickyEnabled={stickyEnabled}
                    onStickyChange={setStickyEnabled}
                    activeSet={activeSet}
                    setOptions={setOptions}
                    onSetChange={handleSetChange}
                    activeGroup={activeGroup}
                    groupOptions={groupOptions}
                    onGroupChange={handleGroupChange}
                    activeGroupLabel={activeGroupLabel}
                    isReading={isReading}
                    isResume={isResume}
                    displayChar={displayChar}
                    statusLabel={statusLabel}
                    currentRomaji={currentRomaji}
                    readSoFar={readSoFar}
                    groupTotal={groupTotal}
                    groupList={groupList}
                    percentRead={percentRead}
                    onStart={startReading}
                    onStop={stopReading}
                />

                <SectionHeading
                    step={`01 · ${t(`japanese.kana.tabs.${activeSet}`)}`}
                    label={activeGroupLabel}
                    hint={t('japanese.kana.gridHint')}
                />

                <KanaGrid
                    kanaList={kanaChars[activeGroup]}
                    columns={groupColumns[activeGroup]}
                    activeChar={readingChar}
                    onRead={handleCardRead}
                />
            </div>
        </Section>
    );
}
