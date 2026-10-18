// -Path: 'client/app/pages/characters/en/components/ChacterToolbar.tsx'
import { motion } from 'framer-motion';
import StickyToggle from './StickyToggle';
import { Languages } from '~/data/language';
import TransportPane from './TransportPane';
import { useTranslation } from 'react-i18next';
import VoicePicker from '~/components/config/VoicePicker';
import { useChromeStore } from '~/stores/config/chrome.store';
import SetTabs, { type SetTabOption } from '~/components/custom/SetTabs';
import { useCharacterToolbar } from '~/hooks/characters/useChacterToolbar';
import type { ActiveGroups, ActiveSet, CharLang } from '~/types/characters';
import { type CharacterReader } from '~/hooks/characters/useCharacterReader';

/** Props for {@link ChacterToolbar}. */
interface ChacterToolbarProps<Lang extends CharLang> {
    lang: Lang;
    characterReader: CharacterReader<Lang>;
}

/**
 * The sticky control bar for the chacter chart: pin toggle, set and group
 * tabs, then the reading console and voice picker side by side.
 *
 * @param props - ChacterToolbar props.
 * @returns The rendered toolbar.
 */
export default function ChacterToolbar<Lang extends CharLang>({
    lang,
    characterReader,
}: ChacterToolbarProps<Lang>) {
    const {
        options,
        activeSet,
        activeGroup,
        stickyEnabled,
        setActiveSet,
        setActiveGroup,
        setStickyEnabled,
    } = useCharacterToolbar(lang);
    const { t } = useTranslation();
    const language = Languages[lang];
    const { showChrome } = useChromeStore();
    const { stopReading } = characterReader;

    const onSetChange = (option: SetTabOption<string, ActiveSet[Lang]>) => {
        stopReading();
        setActiveSet(option.id);
    };

    const onGroupChange = (option: SetTabOption<string, ActiveGroups[Lang]>) => {
        stopReading();
        setActiveGroup(option.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, top: showChrome ? '4.5rem' : '1rem' }}
            transition={{
                opacity: { duration: 0.5, delay: 0.2 },
                y: { duration: 0.5, delay: 0.2 },
                top: { type: 'spring', stiffness: 400, damping: 34 },
            }}
            className={`rounded-sm border border-line bg-surface p-4 sm:p-5 mb-10 ${
                stickyEnabled ? 'sticky z-30 shadow-lg shadow-line/20' : ''
            }`}
        >
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <StickyToggle enabled={stickyEnabled} onChange={setStickyEnabled} />
                {activeSet && (
                    <SetTabs
                        active={activeSet}
                        onChange={onSetChange}
                        options={options.setId.map((id) => ({
                            id: id as ActiveSet[Lang],
                            label: t(`${language}.character.tabs.${id}`),
                        }))}
                    />
                )}
                {activeGroup && (
                    <SetTabs
                        active={activeGroup}
                        onChange={onGroupChange}
                        options={options.groupId.map((id) => ({
                            id: id as ActiveGroups[Lang],
                            label: t(`${language}.character.tabs.${id}`),
                        }))}
                    />
                )}
            </div>

            <div className='my-4 h-px bg-line' />

            {/* reading console */}
            <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch'>
                <TransportPane lang={lang} render={() => <></>} characterReader={characterReader} />

                {/* hairline divider */}
                <div className='hidden w-px shrink-0 self-stretch bg-line sm:block' />

                {/* voice pane */}
                <div className='flex flex-col justify-center gap-2 rounded-sm bg-surface-overlay p-3 sm:w-72 sm:shrink-0 sm:p-3.5'>
                    <VoicePicker />
                </div>
            </div>
        </motion.div>
    );
}
