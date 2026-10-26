// -Path: 'client/app/pages/characters/en/components/ChacterToolbar.tsx'
import { motion } from 'framer-motion';
import StickyToggle from './StickyToggle';
import TransportPane from './TransportPane';
import ReadingVolume from './ReadingVolume';
import { Languages } from '~/data/language';
import { useTranslation } from 'react-i18next';
import { useChromeStore } from '~/stores/config/chrome.store';
import SetTabs, { type SetTabOption } from '~/components/custom/SetTabs';
import type { ActiveGroups, ActiveSet, CharLang } from '~/types/characters';
import { useCharacterToolbar } from '~/hooks/characters/useCharacterToolbar';

/**
 * The sticky control bar for the chacter chart: pin toggle, set and group
 * tabs, then the reading console and the voice picker (chooser + preview +
 * volume, limited to this chart's language) side by side.
 *
 * @param props - ChacterToolbar props.
 * @returns The rendered toolbar.
 */
export default function ChacterToolbar() {
    const {
        lang,
        options,
        activeSet,
        activeGroup,
        stickyEnabled,
        stopReading,
        setActiveSet,
        setActiveGroup,
    } = useCharacterToolbar();
    const { t } = useTranslation();
    const language = Languages[lang];
    const { showChrome } = useChromeStore();

    const onSetChange = (option: SetTabOption<string, ActiveSet[CharLang]>) => {
        stopReading();
        setActiveSet(option.id);
    };

    const onGroupChange = (option: SetTabOption<string, ActiveGroups[CharLang]>) => {
        stopReading();
        setActiveGroup(option.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, top: showChrome ? '4.5rem' : '1rem' }}
            transition={{
                y: { duration: 0.5, delay: 0.2 },
                opacity: { duration: 0.5, delay: 0.2 },
                top: { type: 'spring', stiffness: 400, damping: 34 },
            }}
            className={`rounded-sm border border-line bg-surface p-3 md:p-5 mb-10 ${
                stickyEnabled ? 'sticky z-30 shadow-lg shadow-line/20' : ''
            }`}
        >
            <div className='flex gap-2 sm:gap-4 flex-row sm:items-center sm:justify-between overflow-x-auto'>
                <StickyToggle />
                {activeSet && (
                    <SetTabs
                        active={activeSet}
                        onChange={onSetChange}
                        options={options.setId.map((id) => ({
                            id: id as ActiveSet[CharLang],
                            label: t(`${language}.character.tabs.${id}`),
                        }))}
                    />
                )}
                {activeGroup && (
                    <SetTabs
                        active={activeGroup}
                        onChange={onGroupChange}
                        options={options.groupId.map((id) => ({
                            id: id as ActiveGroups[CharLang],
                            label: t(`${language}.character.tabs.${id}`),
                        }))}
                    />
                )}
            </div>

            <div className='my-2 h-px bg-line' />

            {/* reading console */}
            <div className='flex flex-col gap-2 md:flex-row sm:items-stretch'>
                <TransportPane />

                {/* hairline divider */}
                <div className='hidden w-px shrink-0 self-stretch bg-line md:block' />

                <ReadingVolume />
            </div>
        </motion.div>
    );
}
