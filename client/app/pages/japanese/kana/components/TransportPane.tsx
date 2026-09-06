// -Path: 'client/app/pages/japanese/kana/components/TransportPane.tsx'
import { motion } from 'framer-motion';
import Button from '~/components/custom/Button';
import { FaPlay, FaStop } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import type { Kana } from '~/data/japanese/kana';

interface TransportPaneProps {
    isReading: boolean;
    isResume: boolean;
    displayChar: string | null;
    statusLabel: string;
    activeGroupLabel: string;
    currentRomaji: string;
    readSoFar: number;
    groupTotal: number;
    groupList: Kana[];
    percentRead: number;
    onStart: () => void;
    onStop: () => void;
}

export default function TransportPane({
    isReading,
    isResume,
    displayChar,
    statusLabel,
    activeGroupLabel,
    currentRomaji,
    readSoFar,
    groupTotal,
    groupList,
    percentRead,
    onStart,
    onStop,
}: TransportPaneProps) {
    const { t } = useTranslation();

    return (
        <div className='flex flex-1 flex-col justify-between gap-2.5 rounded-sm bg-surface-overlay p-3 sm:p-3.5'>
            <div className='flex items-center gap-3'>
                <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-sm border transition-colors duration-200 ${
                        isReading
                            ? 'border-accent bg-accent-subtle'
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
                            isReading ? 'text-accent' : 'text-surface-foreground'
                        }`}
                    >
                        {displayChar ?? '—'}
                    </motion.span>
                </div>

                <div className='min-w-0 flex-1'>
                    <p className='flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-surface-muted'>
                        {isReading && (
                            <span className='inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent' />
                        )}
                        <span className='truncate'>{statusLabel}</span>
                        <span className='text-line-strong'>·</span>
                        <span className='truncate text-accent'>{activeGroupLabel}</span>
                    </p>
                    <p className='mt-0.5 truncate font-mono text-xs font-semibold text-accent'>
                        {currentRomaji || '—'}
                        <span className='ml-1.5 text-[11px] font-medium text-surface-muted'>
                            {t('japanese.kana.readProgress', {
                                read: readSoFar,
                                total: groupTotal,
                            })}
                        </span>
                    </p>
                </div>

                <Button
                    variant={isReading ? 'outline' : isResume ? 'secondary' : 'primary'}
                    size='sm'
                    onClick={() => (isReading ? onStop() : onStart())}
                    className='h-9 shrink-0 whitespace-nowrap'
                >
                    {isReading ? (
                        <FaStop className='h-3.5 w-3.5' />
                    ) : (
                        <FaPlay className='h-3.5 w-3.5' />
                    )}
                    <span>
                        {isReading
                            ? t('japanese.kana.readStop')
                            : isResume
                              ? t('japanese.kana.readContinue')
                              : t('japanese.kana.readStart')}
                    </span>
                    <kbd className='ml-0.5 hidden shrink-0 items-center rounded-sm border border-current px-1 py-0.5 font-mono text-[9px] font-semibold tracking-widest opacity-70 sm:inline-flex'>
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
                                        ? 'bg-accent'
                                        : isDone
                                          ? 'bg-accent/40'
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
