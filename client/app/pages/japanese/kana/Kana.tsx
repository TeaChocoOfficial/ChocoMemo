// -Path: 'client/app/pages/japanese/kana/Kana.tsx'
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import KanaGrid from './components/KanaGrid';
import Button from '~/components/custom/Button';
import Badge from '~/components/custom/Badge';
import { FaArrowLeft, FaPlay, FaStop, FaThumbtack } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { KANA_CHARS } from '~/data/japanese/kana';
import { getVoiceForSpeech } from '~/hooks/useSpeak';
import VoicePicker from '../../../components/config/VoicePicker';
import { useSpeechStore } from '~/stores/speech.store';
import { useKanaProgressStore } from '~/stores/kanaProgress.store';
import type { Kana, KanaChars, KanaSetId } from '~/data/japanese/kana';
import SetTabs, { type SetTabOption } from '~/components/custom/SetTabs';
import { useChromeStore } from '~/stores/chrome.store';
import Section from '~/components/custom/Section';

interface Stat {
    label: string;
    value: string;
}

function SectionHeading({ step, label, hint }: { step: string; label: string; hint: string }) {
    return (
        <div className='mb-6'>
            <div className='flex items-center gap-3'>
                <span className='font-mono text-xs font-bold tracking-[0.14em] text-accent'>
                    {step}
                </span>
                <span className='h-px w-10 bg-line-strong' />
                <h2 className='text-xl sm:text-2xl font-bold tracking-tight text-surface-foreground'>
                    {label}
                </h2>
            </div>
            <p className='mt-2 text-sm leading-relaxed text-surface-muted'>{hint}</p>
        </div>
    );
}

export default function KanaPage() {
    const { t } = useTranslation();
    const { showChrome } = useChromeStore();
    const [activeSet, setActiveSet] = useState<KanaSetId>('hiragana');
    const [activeGroup, setActiveGroup] = useState<keyof KanaChars>('voiceless');
    const [isReading, setIsReading] = useState(false);
    const [readingChar, setReadingChar] = useState<string | null>(null);
    const [stickyEnabled, setStickyEnabled] = useState(true);
    const readingRef = useRef(false);

    const { voiceURI, lang, rate, volume } = useSpeechStore();
    const { progress, recordRead } = useKanaProgressStore();

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
    const groupColumns: Record<keyof KanaChars, number> = {
        voiceless: 5,
        voiced: 5,
        contracted: 3,
    };

    const activeGroupLabel = groupOptions.find((group) => group.id === activeGroup)?.label ?? '';

    const key = `${activeSet}:${activeGroup}`;
    const countGroup = (list: Kana[]) => list.filter((kana) => kana.char).length;
    const setTotal =
        countGroup(kanaChars.voiceless) +
        countGroup(kanaChars.voiced) +
        countGroup(kanaChars.contracted);
    const groupList = kanaChars[activeGroup].filter((kana) => kana.char);
    const groupTotal = groupList.length;

    const lastReadIndex = progress[key] ?? 0;
    const displayChar = readingChar ?? kanaChars[activeGroup][lastReadIndex]?.char ?? null;
    const readSoFar = displayChar
        ? groupList.findIndex((kana) => kana.char === displayChar) + 1
        : 0;
    const isResume = readSoFar > 0;
    const percentRead = groupTotal ? Math.round((readSoFar / groupTotal) * 100) : 0;
    const currentRomaji = isResume ? (groupList[readSoFar - 1]?.romaji ?? '') : '';
    const statusLabel = isReading
        ? t('japanese.kana.nowReading')
        : isResume
          ? t('japanese.kana.upNext')
          : t('japanese.kana.readStart');

    const stats: Stat[] = [
        { label: t('japanese.kana.stats.set'), value: setTotal.toLocaleString() },
        { label: t('japanese.kana.stats.group'), value: groupTotal.toLocaleString() },
        {
            label: t('japanese.kana.stats.read'),
            value: t('japanese.kana.readProgress', { read: readSoFar, total: groupTotal }),
        },
    ];

    const stopReading = useCallback(() => {
        readingRef.current = false;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsReading(false);
        setReadingChar(null);
    }, []);

    const startReading = useCallback(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

        const list = kanaChars[activeGroup];
        if (list.length === 0) return;

        let index = progress[key] ?? 0;
        if (index >= list.length) index = 0;

        window.speechSynthesis.cancel();
        readingRef.current = true;
        setIsReading(true);

        const step = (position: number) => {
            if (!readingRef.current) return;
            const kana = list[position];

            if (!kana) {
                recordRead(key, 0);
                readingRef.current = false;
                setIsReading(false);
                setReadingChar(null);
                return;
            }

            if (!kana.char) {
                step(position + 1);
                return;
            }

            setReadingChar(kana.char);

            const utterance = new SpeechSynthesisUtterance(kana.char);
            utterance.lang = lang;
            utterance.rate = rate;
            utterance.volume = volume;
            utterance.pitch = 1;

            const voice = getVoiceForSpeech(voiceURI);
            if (voice) utterance.voice = voice;

            utterance.onstart = () => {
                if (!readingRef.current) return;
                recordRead(key, position);
            };
            utterance.onend = () => {
                if (!readingRef.current) return;
                step(position + 1);
            };
            utterance.onerror = () => {
                readingRef.current = false;
                setIsReading(false);
                setReadingChar(null);
            };

            window.speechSynthesis.speak(utterance);
        };

        step(index);
    }, [activeGroup, key, kanaChars, lang, progress, rate, recordRead, voiceURI, volume]);

    const handleCardRead = useCallback(
        (kana: Kana, index: number) => {
            recordRead(key, index);
            setReadingChar(kana.char);
            if (readingRef.current) stopReading();
        },
        [key, recordRead, stopReading],
    );

    useEffect(() => {
        return stopReading;
    }, [stopReading]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code !== 'Space') return;
            const tag = (event.target as HTMLElement | null)?.tagName;
            if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')
                return;
            event.preventDefault();
            if (isReading) stopReading();
            else startReading();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isReading, startReading, stopReading]);

    const handleSetChange = (option: SetTabOption) => {
        stopReading();
        setActiveSet(option.id as KanaSetId);
    };

    const handleGroupChange = (option: SetTabOption) => {
        stopReading();
        setActiveGroup(option.id as keyof KanaChars);
    };

    return (
        <Section >
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
                    className='text-center mb-8'
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

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className='grid grid-cols-3 gap-4 mb-6'
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className='rounded-sm border border-line bg-surface-overlay px-5 py-4'
                        >
                            <p className='text-2xl sm:text-3xl font-black tracking-tight text-surface-foreground'>
                                {stat.value}
                            </p>
                            <p className='mt-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* tool bar */}
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
                        <div
                            role='group'
                            aria-label={t('japanese.kana.sticky')}
                            title={
                                stickyEnabled
                                    ? t('japanese.kana.unpinToolbar')
                                    : t('japanese.kana.pinToolbar')
                            }
                            className='inline-flex items-center rounded-sm border border-line bg-surface-overlay p-1'
                        >
                            <span className='flex items-center gap-1.5 border-r border-line pr-2 pl-1.5'>
                                <FaThumbtack className='h-3.5 w-3.5 text-accent' />
                                <span className='font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted'>
                                    {t('japanese.kana.sticky')}
                                </span>
                            </span>
                            <div className='relative ml-1 flex items-center gap-0.5'>
                                {([true, false] as const).map((enabled) => {
                                    const active = stickyEnabled === enabled;
                                    return (
                                        <button
                                            key={String(enabled)}
                                            type='button'
                                            aria-pressed={active}
                                            onClick={() => setStickyEnabled(enabled)}
                                            aria-label={
                                                enabled
                                                    ? t('japanese.kana.pinToolbar')
                                                    : t('japanese.kana.unpinToolbar')
                                            }
                                            className={`relative rounded-sm px-2.5 py-1 text-xs font-bold transition-colors duration-200 cursor-pointer ${
                                                active
                                                    ? 'text-accent-foreground'
                                                    : 'text-surface-muted hover:text-surface-foreground'
                                            }`}
                                        >
                                            {active && (
                                                <motion.span
                                                    layoutId='sticky-toggle-pill'
                                                    className='absolute inset-0 rounded-sm bg-accent'
                                                    transition={{
                                                        type: 'spring',
                                                        stiffness: 300,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}
                                            <span className='relative z-10'>
                                                {enabled
                                                    ? t('japanese.kana.stickyOn')
                                                    : t('japanese.kana.stickyOff')}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <SetTabs
                            active={activeSet}
                            options={setOptions}
                            onChange={handleSetChange}
                        />
                        <SetTabs
                            options={groupOptions}
                            active={activeGroup}
                            onChange={handleGroupChange}
                        />
                    </div>

                    <div className='my-4 h-px bg-line' />

                    {/* reading console */}
                    <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0'>
                        {/* transport pane */}
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
                                            isReading
                                                ? 'text-accent'
                                                : 'text-surface-foreground'
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
                                        <span className='truncate text-accent'>
                                            {activeGroupLabel}
                                        </span>
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
                                    variant={
                                        isReading
                                            ? 'outline'
                                            : isResume
                                              ? 'secondary'
                                              : 'primary'
                                    }
                                    size='sm'
                                    onClick={() =>
                                        isReading ? stopReading() : startReading()
                                    }
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

                        {/* hairline divider */}
                        <div className='hidden w-px shrink-0 self-stretch bg-line sm:block' />

                        {/* voice pane */}
                        <div className='flex flex-col justify-center gap-2 rounded-sm bg-surface-overlay p-3 sm:w-72 sm:shrink-0 sm:p-3.5'>
                            <VoicePicker />
                        </div>
                    </div>
                </motion.div>

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
