// -Path: 'client/app/pages/characters/en/components/TransportPane.tsx'
import { motion } from 'framer-motion';
import { Languages } from '~/data/language';
import { useTranslation } from 'react-i18next';
import Button from '~/components/custom/Button';
import { FaPlay, FaStop } from 'react-icons/fa6';
import type { CharLang, ReadableChar } from '~/types/characters';
import { useCharacterToolbar } from '~/hooks/characters/useChacterToolbar';
import { type CharacterReader } from '~/hooks/characters/useCharacterReader';

/** Props for {@link TransportPane}. */
interface TransportPaneProps<Lang extends CharLang> {
    lang: Lang;
    characterReader: CharacterReader<Lang>;
    getCurrentName?: (group: ReadableChar) => string;
    render: (groupList: ReadableChar[]) => React.ReactNode;
}

/**
 * The left half of the toolbar's console: current-letter tile, status line,
 * start/stop button with its Space shortcut, and the scrubber rail.
 *
 * @param props - TransportPane props.
 * @returns The rendered transport pane.
 */
export default function TransportPane<Lang extends CharLang>({
    lang,
    render,
    getCurrentName,
    characterReader,
}: TransportPaneProps<Lang>) {
    const { t } = useTranslation();
    const language = Languages[lang];
    const { activeGroup, options } = useCharacterToolbar(lang);

    const {
        isReading,
        isResume,
        displayChar,
        readSoFar,
        groupTotal,
        groupList,
        percentRead,
        startReading,
        stopReading,
    } = characterReader;
    const activeGroupId = options.groupId.find((group) => group === activeGroup);

    const currentGroup = groupList[readSoFar - 1];
    const currentName = isResume ? (getCurrentName?.(currentGroup) ?? currentGroup.char ?? '') : '';
    const statusLabel = isReading
        ? t(`${language}.character.nowReading`)
        : isResume
          ? t(`${language}.character.upNext`)
          : t(`${language}.character.readStart`);

    return (
        <div className='flex flex-1 flex-col justify-between gap-2.5 rounded-sm bg-surface-overlay p-3 sm:p-3.5'>
            <div className='flex items-center gap-3'>
                <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-sm border transition-colors duration-200 ${
                        isReading
                            ? 'border-primary bg-primary-subtle'
                            : 'border-line-strong bg-surface'
                    }`}
                >
                    <motion.span
                        key={displayChar ?? 'empty'}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 350,
                            damping: 22,
                        }}
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
                            {t(`${language}.character.group.${activeGroupId}`)}
                        </span>
                    </p>
                    <p className='mt-0.5 truncate font-mono text-xs font-semibold text-primary'>
                        {currentName || '—'}
                        <span className='ml-1.5 text-[11px] font-medium text-surface-muted'>
                            {t('english.character.readProgress', {
                                read: readSoFar,
                                total: groupTotal,
                            })}
                        </span>
                    </p>
                </div>

                <Button
                    variant={isReading ? 'outline' : isResume ? 'secondary' : 'primary'}
                    size='sm'
                    onClick={() => (isReading ? stopReading() : startReading())}
                    className='h-9 shrink-0 whitespace-nowrap'
                >
                    {isReading ? (
                        <FaStop className='h-3.5 w-3.5' />
                    ) : (
                        <FaPlay className='h-3.5 w-3.5' />
                    )}
                    <span>
                        {isReading
                            ? t('english.character.readStop')
                            : isResume
                              ? t('english.character.readContinue')
                              : t('english.character.readStart')}
                    </span>
                    <kbd className='ml-0.5 hidden shrink-0 items-center rounded-sm border border-current px-1 py-0.5 font-mono text-[9px] font-semibold tracking-widest opacity-70 sm:inline-flex'>
                        SPC
                    </kbd>
                </Button>
            </div>

            {/* scrubber rail */}
            <div className='flex h-6 items-center gap-3'>
                <div className='flex flex-1 gap-0.5'>{render(groupList)}</div>
                <span className='w-9 shrink-0 text-right font-mono text-[11px] font-semibold tabular-nums text-surface-muted'>
                    {percentRead}%
                </span>
            </div>
        </div>
    );
}
