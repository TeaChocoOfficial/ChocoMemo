// -Path: 'client/app/pages/japanese/kana/components/KanaToolbar.tsx'
import { motion } from 'framer-motion';
import { useChromeStore } from '~/stores/config/chrome.store';
import SetTabs, { type SetTabOption } from '~/components/custom/SetTabs';
import VoicePicker from '../../../../components/config/VoicePicker';
import StickyToggle from './StickyToggle';
import TransportPane from './TransportPane';
import type { Kana } from '~/data/japanese/kana';

interface KanaToolbarProps {
    stickyEnabled: boolean;
    onStickyChange: (enabled: boolean) => void;
    activeSet: string;
    setOptions: SetTabOption[];
    onSetChange: (option: SetTabOption) => void;
    activeGroup: string;
    groupOptions: SetTabOption[];
    onGroupChange: (option: SetTabOption) => void;
    activeGroupLabel: string;
    isReading: boolean;
    isResume: boolean;
    displayChar: string | null;
    statusLabel: string;
    currentRomaji: string;
    readSoFar: number;
    groupTotal: number;
    groupList: Kana[];
    percentRead: number;
    onStart: () => void;
    onStop: () => void;
}

export default function KanaToolbar({
    stickyEnabled,
    onStickyChange,
    activeSet,
    setOptions,
    onSetChange,
    activeGroup,
    groupOptions,
    onGroupChange,
    activeGroupLabel,
    isReading,
    isResume,
    displayChar,
    statusLabel,
    currentRomaji,
    readSoFar,
    groupTotal,
    groupList,
    percentRead,
    onStart,
    onStop,
}: KanaToolbarProps) {
    const { showChrome } = useChromeStore();

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
                <StickyToggle enabled={stickyEnabled} onChange={onStickyChange} />
                <SetTabs active={activeSet} options={setOptions} onChange={onSetChange} />
                <SetTabs options={groupOptions} active={activeGroup} onChange={onGroupChange} />
            </div>

            <div className='my-4 h-px bg-line' />

            {/* reading console */}
            <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0'>
                <TransportPane
                    isReading={isReading}
                    isResume={isResume}
                    displayChar={displayChar}
                    statusLabel={statusLabel}
                    activeGroupLabel={activeGroupLabel}
                    currentRomaji={currentRomaji}
                    readSoFar={readSoFar}
                    groupTotal={groupTotal}
                    groupList={groupList}
                    percentRead={percentRead}
                    onStart={onStart}
                    onStop={onStop}
                />

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
