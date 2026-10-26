// -Path: 'client/app/pages/characters/en/components/TransportPane.tsx'
import { motion } from 'framer-motion';
import { Languages } from '~/data/language';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { FaPlay, FaStop } from 'react-icons/fa6';
import { useCharacterToolbar } from '~/hooks/characters/useCharacterToolbar';

/**
 * The left half of the toolbar's console: current-letter tile, status line,
 * start/stop button with its Space shortcut, and the scrubber rail.
 *
 * @param props - TransportPane props.
 * @returns The rendered transport pane.
 */
export default function TransportPane() {
    const {
        lang,
        options,
        isResume,
        isReading,
        groupList,
        readSoFar,
        groupTotal,
        activeGroup,
        percentRead,
        displayChar,
        stopReading,
        startReading,
    } = useCharacterToolbar();
    const { t } = useTranslation();
    const language = Languages[lang];

    const activeGroupId = options.groupId.find((group) => group === activeGroup);

    const currentGroup = groupList[readSoFar - 1];
    const currentName = isResume ? (currentGroup.char ?? '') : '';
    const statusLabel = isReading
        ? t('characters.nowReading')
        : isResume
          ? t('characters.upNext')
          : t('characters.readStart');

    return (
        <div className='flex flex-1 flex-col justify-between gap-2.5 rounded-sm bg-surface-overlay p-3 sm:p-3.5'>
            <div className='flex items-center gap-3'>
                <div
                    className={`grid h-10 min-w-10 p-2 shrink-0 place-items-center rounded-sm border transition-colors duration-200 ${
                        isReading
                            ? 'border-primary bg-primary-subtle'
                            : 'border-line-strong bg-surface'
                    }`}
                >
                    <motion.span
                        key={displayChar ?? 'empty'}
                        animate={{ scale: 1, opacity: 1 }}
                        initial={{ scale: 0.85, opacity: 0 }}
                        transition={{ damping: 22, type: 'spring', stiffness: 350 }}
                        className={`text-xl font-black leading-none ${
                            isReading ? 'text-primary' : 'text-surface-foreground'
                        }`}
                    >
                        {displayChar ?? '—'}
                    </motion.span>
                </div>

                <div className='min-w-0 flex-1'>
                    <p className='flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-surface-muted'>
                        {isReading && (
                            <span className='inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary' />
                        )}
                        <span className='truncate'>{statusLabel}</span>
                        <span className='text-line-strong'>·</span>
                        <span className='truncate text-primary'>
                            {t(`${language}.character.tabs.${activeGroupId}`)}
                        </span>
                    </p>
                    <p className='mt-0.5 truncate font-mono text-xs font-semibold text-primary'>
                        {currentName || '—'}
                        <span className='ml-1.5 text-[11px] font-medium text-surface-muted'>
                            {t('characters.readProgress', {
                                read: readSoFar,
                                total: groupTotal,
                            })}
                        </span>
                    </p>
                </div>

                <Button
                    size='sm'
                    className='h-9 shrink-0 whitespace-nowrap'
                    onClick={() => (isReading ? stopReading() : startReading())}
                    variant={isReading ? 'outline' : isResume ? 'secondary' : 'primary'}
                >
                    {isReading ? (
                        <FaStop className='h-3.5 w-3.5' />
                    ) : (
                        <FaPlay className='h-3.5 w-3.5' />
                    )}
                    <span className='hidden md:inline-flex'>
                        {isReading
                            ? t('characters.readStop')
                            : isResume
                              ? t('characters.readContinue')
                              : t('characters.readStart')}
                    </span>
                    <kbd className='ml-0.5 hidden shrink-0 items-center rounded-sm border border-current px-1 py-0.5 font-mono text-[9px] font-semibold tracking-widest opacity-70 lg:inline-flex'>
                        SPC
                    </kbd>
                </Button>
            </div>

            {/* scrubber rail */}
            <div className='flex h-6 items-center gap-3'>
                <div className='flex flex-1 gap-0.5'>
                    {groupList.map((kana, index) => {
                        const isCurrent = index === readSoFar - 1;
                        const isDone = index < readSoFar - 1;
                        return (
                            <span
                                key={`${kana.char}-${index}`}
                                className={`h-1 min-w-0 flex-1 rounded-[1px] transition-colors duration-300 ${
                                    isCurrent
                                        ? 'bg-primary'
                                        : isDone
                                          ? 'bg-primary/40'
                                          : 'bg-line/60'
                                }`}
                            />
                        );
                    })}
                </div>
                <span className='w-9 shrink-0 text-right font-mono text-[11px] font-semibold tabular-nums text-surface-muted'>
                    {percentRead}%
                </span>
            </div>
        </div>
    );
}
