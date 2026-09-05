// -Path: 'client/app/pages/japanese/kana-drill/components/game/QuizPlaying.tsx'
import { useEffect } from 'react';
import QuizStats from './QuizStats';
import QuizTimer from './QuizTimer';
import QuizQuestion from './QuizQuestion';
import QuizFeedback from './QuizFeedback';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import type { Choice } from '~/hooks/useQuizEngine';
import type { QuizMode } from '../../hooks/useKanaDrill';
import QuizChoices, { type ChoiceFeedback } from './QuizChoices';

interface QuizPlayingProps {
    total: number;
    score: number;
    mode: QuizMode;
    prompt: string;
    current: number;
    timeLeft: number;
    choices: Choice[];
    timedOut: boolean;
    disabled: boolean;
    timeLimit: number;
    wrongCount: number;
    promptLabel: string;
    autoAdvance: boolean;
    timeoutCount: number;
    showFeedback: boolean;
    questionIndex: number;
    lastChoice: Choice | null;
    correctAnswerText: string;
    feedback: Record<string, ChoiceFeedback>;
    onEnd: () => void;
    onNext: () => void;
    onListen: () => void;
    onSelect: (choice: Choice) => void;
}

export default function QuizPlaying({
    mode,
    current,
    total,
    questionIndex,
    prompt,
    promptLabel,
    correctAnswerText,
    timeLimit,
    timeLeft,
    score,
    wrongCount,
    timeoutCount,
    choices,
    feedback,
    disabled,
    showFeedback,
    lastChoice,
    timedOut,
    autoAdvance,
    onSelect,
    onNext,
    onEnd,
    onListen,
}: QuizPlayingProps) {
    const { t } = useTranslation();
    const isListen = mode === 'listenToChar';

    useEffect(() => {
        if (isListen && showFeedback === false) onListen();
    }, [isListen, questionIndex, showFeedback]);

    return (
        <div>
            <QuizStats
                total={total}
                score={score}
                current={current}
                wrongCount={wrongCount}
                timeoutCount={timeoutCount}
                onEnd={onEnd}
            />

            {timeLimit > 0 && <QuizTimer timeLeft={timeLeft} timeLimit={timeLimit} />}

            <QuizQuestion current={questionIndex} prompt={prompt} promptLabel={promptLabel} />

            {isListen && (
                <div className='flex justify-center -mt-4 mb-6'>
                    <button
                        type='button'
                        onClick={onListen}
                        aria-label={t('japanese.kanaDrill.listenAgain')}
                        className='inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-surface text-surface-foreground border-2 border-accent hover:bg-accent hover:text-accent-foreground transition-colors duration-200 cursor-pointer active:translate-y-px'
                    >
                        <FaVolumeHigh className='w-12 h-12' />
                    </button>
                </div>
            )}

            <QuizChoices
                choices={choices}
                feedback={feedback}
                disabled={disabled}
                onSelect={onSelect}
            />

            {showFeedback && (
                <QuizFeedback
                    lastChoice={lastChoice}
                    timedOut={timedOut}
                    correctAnswerText={correctAnswerText}
                    autoAdvance={autoAdvance}
                    onNext={onNext}
                />
            )}
        </div>
    );
}
