// -Path: 'client/app/pages/japanese/characters/quiz/components/QuizResult.tsx'
// Detailed results screen for the character quiz: settings summary, score
// breakdown, scrollable question history, and Play Again / Settings / Exit buttons.
import { motion } from 'framer-motion';
import {
    FaRotateRight,
    FaGear,
    FaArrowRightFromBracket,
    FaCheck,
    FaXmark,
    FaClock,
} from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import type { QuizSettingsState } from './QuizSettings';
import type { HistoryEntry } from '../../hooks/useCharacterQuiz';

interface QuizResultProps {
    score: number;
    wrongCount: number;
    timeoutCount: number;
    total: number;
    history: HistoryEntry[];
    settings: QuizSettingsState;
    title: string;
    playAgainLabel: string;
    settingsLabel: string;
    exitLabel: string;
    onRetry: () => void;
    onSettings: () => void;
    onExit: () => void;
}

export default function QuizResult({
    score,
    wrongCount,
    timeoutCount,
    total,
    history,
    settings,
    title,
    playAgainLabel,
    settingsLabel,
    exitLabel,
    onRetry,
    onSettings,
    onExit,
}: QuizResultProps) {
    const { t } = useTranslation();
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    const rank = percentage >= 90 ? '秀' : percentage >= 70 ? '優' : percentage >= 50 ? '良' : '可';
    const rankColor =
        percentage >= 70 ? 'text-success' : percentage >= 50 ? 'text-warning' : 'text-error';

    const barColor = percentage >= 70 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-error';

    const setsUsed: string[] = [];
    if (settings.hiragana.voiceless || settings.hiragana.voiced || settings.hiragana.contracted) {
        setsUsed.push(t('japanese.characters.tabs.hiragana'));
    }
    if (settings.katakana.voiceless || settings.katakana.voiced || settings.katakana.contracted) {
        setsUsed.push(t('japanese.characters.tabs.katakana'));
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='max-w-lg mx-auto text-center rounded-sm border border-line bg-surface p-8 space-y-8'
        >
            {/* Title + rank */}
            <div>
                <div className={`text-7xl font-black leading-none mb-4 ${rankColor}`}>{rank}</div>
                <h2 className='text-3xl font-black tracking-tight text-surface-foreground mb-2'>
                    {title}
                </h2>
                <p className='text-lg text-surface-muted'>
                    {score} / {total} · {percentage}%
                </p>
            </div>

            {/* Score bar */}
            <div className='relative h-3 w-full bg-surface-overlay border border-line overflow-hidden'>
                <motion.div
                    className={`h-full ${barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                />
            </div>

            {/* Stats breakdown */}
            <div className='grid grid-cols-3 gap-3 text-left'>
                <div className='rounded-sm border border-line bg-surface-overlay p-3'>
                    <div className='flex items-center gap-1.5 text-xs font-bold text-surface-muted mb-1'>
                        <FaCheck className='w-3 h-3 text-success' />
                        {t('japanese.characterQuiz.result.correctLabel')}
                    </div>
                    <p className='text-2xl font-black text-success'>{score}</p>
                </div>
                <div className='rounded-sm border border-line bg-surface-overlay p-3'>
                    <div className='flex items-center gap-1.5 text-xs font-bold text-surface-muted mb-1'>
                        <FaXmark className='w-3 h-3 text-error' />
                        {t('japanese.characterQuiz.result.wrongLabel')}
                    </div>
                    <p className='text-2xl font-black text-error'>{wrongCount}</p>
                </div>
                <div className='rounded-sm border border-line bg-surface-overlay p-3'>
                    <div className='flex items-center gap-1.5 text-xs font-bold text-surface-muted mb-1'>
                        <FaClock className='w-3 h-3 text-warning' />
                        {t('japanese.characterQuiz.result.timeoutLabel')}
                    </div>
                    <p className='text-2xl font-black text-warning'>{timeoutCount}</p>
                </div>
            </div>

            {/* Settings summary */}
            <div className='text-left rounded-sm border border-line bg-surface-overlay p-4 space-y-2 text-sm'>
                <p className='text-xs font-bold uppercase tracking-widest text-surface-muted mb-2'>
                    {t('japanese.characterQuiz.result.settingsSummary')}
                </p>
                <div className='flex justify-between'>
                    <span className='text-surface-muted'>
                        {t('japanese.characterQuiz.settings.setsLabel')}
                    </span>
                    <span className='font-bold text-surface-foreground'>
                        {setsUsed.join(' + ')}
                    </span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-surface-muted'>
                        {t('japanese.characterQuiz.settings.questionCount')}
                    </span>
                    <span className='font-bold text-surface-foreground'>{total}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-surface-muted'>
                        {t('japanese.characterQuiz.settings.choiceCount')}
                    </span>
                    <span className='font-bold text-surface-foreground'>
                        {settings.choiceCount}
                    </span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-surface-muted'>
                        {t('japanese.characterQuiz.settings.modeLabel')}
                    </span>
                    <span className='font-bold text-surface-foreground'>
                        {settings.mode === 'romajiToChar'
                            ? t('japanese.characterQuiz.settings.mode.romajiToChar')
                            : settings.mode === 'listenToChar'
                              ? t('japanese.characterQuiz.settings.mode.listenToChar')
                              : t('japanese.characterQuiz.settings.mode.charToRomaji')}
                    </span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-surface-muted'>
                        {t('japanese.characterQuiz.settings.timeLimit')}
                    </span>
                    <span className='font-bold text-surface-foreground'>{settings.timeLimit}s</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-surface-muted'>
                        {t('japanese.characterQuiz.settings.autoAdvance')}
                    </span>
                    <span className='font-bold text-surface-foreground'>
                        {settings.autoAdvance
                            ? t('japanese.characterQuiz.result.yes')
                            : t('japanese.characterQuiz.result.no')}
                    </span>
                </div>
            </div>

            {/* Question history */}
            {history.length > 0 && (
                <div className='text-left'>
                    <p className='text-xs font-bold uppercase tracking-widest text-surface-muted mb-3'>
                        {t('japanese.characterQuiz.result.history')}
                    </p>
                    <div className='max-h-64 overflow-y-auto rounded-sm border border-line divide-y divide-line'>
                        {history.map((entry, i) => (
                            <div key={i} className='flex items-center gap-3 px-3 py-2 text-sm'>
                                <span className='text-surface-muted tabular-nums w-6 text-right shrink-0'>
                                    {i + 1}
                                </span>
                                <span className='text-xl font-bold text-surface-foreground w-10 text-center shrink-0'>
                                    {entry.char}
                                </span>
                                <span className='text-surface-muted shrink-0'>{entry.romaji}</span>
                                <span className='flex-1 text-right'>
                                    {entry.timedOut ? (
                                        <span className='inline-flex items-center gap-1 text-warning font-bold text-xs'>
                                            <FaClock className='w-3 h-3' />
                                            {t('japanese.characterQuiz.result.timeoutShort')}
                                        </span>
                                    ) : entry.correct ? (
                                        <span className='inline-flex items-center gap-1 text-success font-bold text-xs'>
                                            <FaCheck className='w-3 h-3' />
                                        </span>
                                    ) : (
                                        <span className='inline-flex items-center gap-1 text-error font-bold text-xs'>
                                            <FaXmark className='w-3 h-3' />
                                            {entry.userAnswer}
                                        </span>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className='flex flex-col gap-3'>
                <button
                    type='button'
                    onClick={onRetry}
                    className='inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm bg-accent text-accent-foreground text-base font-semibold transition-colors duration-200 cursor-pointer hover:bg-accent-emphasis active:translate-y-px'
                >
                    <FaRotateRight className='w-4 h-4' />
                    {playAgainLabel}
                </button>
                <div className='flex gap-3'>
                    <button
                        type='button'
                        onClick={onSettings}
                        className='flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm border border-line text-sm font-bold text-surface-foreground hover:bg-surface-overlay transition-colors cursor-pointer'
                    >
                        <FaGear className='w-4 h-4' />
                        {settingsLabel}
                    </button>
                    <a
                        href='/japanese/characters'
                        onClick={onExit}
                        className='flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm border border-line text-sm font-bold text-surface-foreground hover:bg-surface-overlay transition-colors'
                    >
                        <FaArrowRightFromBracket className='w-4 h-4' />
                        {exitLabel}
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
