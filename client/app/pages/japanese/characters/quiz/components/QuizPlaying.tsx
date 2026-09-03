// -Path: 'client/app/pages/japanese/characters/quiz/components/QuizPlaying.tsx'
// Playing phase for the character quiz: progress stats, countdown timer,
// question prompt (mode-aware), an optional listen/replay control, choices,
// and post-answer feedback.
import { useEffect } from 'react';
import { FaVolumeHigh } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import type { Choice } from '~/hooks/useQuizEngine';
import type { QuizMode } from '../hooks/useCharacterQuiz';
import QuizStats from './QuizStats';
import QuizTimer from './QuizTimer';
import QuizQuestion from './QuizQuestion';
import QuizChoices, { type ChoiceFeedback } from './QuizChoices';
import QuizFeedback from './QuizFeedback';

interface QuizPlayingProps {
    mode: QuizMode;
    current: number;
    total: number;
    questionIndex: number;
    prompt: string;
    promptLabel: string;
    correctAnswerText: string;
    timeLimit: number;
    timeLeft: number;
    score: number;
    wrongCount: number;
    timeoutCount: number;
    choices: Choice[];
    feedback: Record<string, ChoiceFeedback>;
    disabled: boolean;
    showFeedback: boolean;
    lastChoice: Choice | null;
    timedOut: boolean;
    autoAdvance: boolean;
    onSelect: (choice: Choice) => void;
    onNext: () => void;
    onEnd: () => void;
    onListen: () => void;
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

    // Auto-play the pronunciation when a listen-mode question appears.
    useEffect(() => {
        if (isListen && showFeedback === false && prompt) {
            onListen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isListen, questionIndex]);

    return (
        <div>
            <QuizStats
                current={current}
                total={total}
                score={score}
                wrongCount={wrongCount}
                timeoutCount={timeoutCount}
                onEnd={onEnd}
            />

            {timeLimit > 0 && <QuizTimer timeLeft={timeLeft} timeLimit={timeLimit} />}

            <QuizQuestion current={questionIndex} prompt={prompt} promptLabel={promptLabel} />

            {isListen && (
                <div className='text-center -mt-4 mb-6'>
                    <button
                        type='button'
                        onClick={onListen}
                        className='inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-line text-sm font-bold text-surface-foreground hover:border-accent hover:text-accent transition-colors cursor-pointer'
                    >
                        <FaVolumeHigh className='w-3.5 h-3.5' />
                        {t('japanese.characterQuiz.listenAgain')}
                    </button>
                </div>
            )}

            <QuizChoices choices={choices} feedback={feedback} disabled={disabled} onSelect={onSelect} />

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