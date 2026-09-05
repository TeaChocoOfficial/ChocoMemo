// -Path: 'client/app/pages/japanese/kana-drill/KanaDrill.tsx'
import { Link } from '~/i18n/routing';
import { useSpeak } from '~/hooks/useSpeak';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import QuizIntro from './components/setting/QuizIntro';
import QuizPlaying from './components/game/QuizPlaying';
import QuizResult from './components/setting/QuizResult';
import { useKanaDrill } from './hooks/useKanaDrill';
import { useQuizSettingsStore } from '~/stores/quizSettings.store';

export default function KanaDrillPage() {
    const speak = useSpeak();
    const { t } = useTranslation();
    const settings = useQuizSettingsStore((s) => s.settings);
    const setSettings = useQuizSettingsStore((s) => s.setSettings);

    const {
        phase,
        round,
        question,
        questionIndex,
        score,
        wrongCount,
        timeoutCount,
        history,
        feedback,
        lastChoice,
        timeLeft,
        timedOut,
        choices,
        answerKind,
        advance,
        endGame,
        startQuiz,
        goToSettings,
        handleSelect,
    } = useKanaDrill(settings);

    const isListen = settings.mode === 'listenToChar';

    const prompt = question
        ? settings.mode === 'charToRomaji'
            ? question.char
            : settings.mode === 'romajiToChar'
              ? question.romaji
              : ''
        : '';

    const promptLabel = isListen
        ? t('japanese.kanaDrill.promptLabelListen')
        : settings.mode === 'charToRomaji'
          ? t('japanese.kanaDrill.promptLabel')
          : t('japanese.kanaDrill.promptLabelRomajiToChar');

    const correctAnswerText = question
        ? answerKind === 'char'
            ? question.char
            : question.romaji
        : '';

    return (
        <section className='relative min-h-screen overflow-hidden py-16 sm:py-20'>
            <div className='mx-auto max-w-3xl px-4 sm:px-6 w-full'>
                {phase === 'intro' && (
                    <>
                        <Link
                            to='/japanese'
                            className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                        >
                            <FaArrowLeft className='w-3.5 h-3.5' />
                            {t('japanese.kanaDrill.back_characters')}
                        </Link>
                        <QuizIntro settings={settings} onChange={setSettings} onStart={startQuiz} />
                    </>
                )}

                {phase === 'playing' && question && (
                    <QuizPlaying
                        mode={settings.mode}
                        current={questionIndex + 1}
                        total={round.length}
                        questionIndex={questionIndex}
                        prompt={prompt}
                        promptLabel={promptLabel}
                        correctAnswerText={correctAnswerText}
                        timeLimit={settings.timeLimit}
                        timeLeft={timeLeft}
                        score={score}
                        wrongCount={wrongCount}
                        timeoutCount={timeoutCount}
                        choices={choices}
                        feedback={feedback}
                        disabled={!!lastChoice || timedOut}
                        showFeedback={!!(lastChoice || timedOut)}
                        lastChoice={lastChoice}
                        timedOut={timedOut}
                        autoAdvance={settings.autoAdvance}
                        onSelect={handleSelect}
                        onNext={advance}
                        onEnd={endGame}
                        onListen={() => speak(question.char)}
                    />
                )}

                {phase === 'result' && (
                    <QuizResult
                        score={score}
                        wrongCount={wrongCount}
                        timeoutCount={timeoutCount}
                        total={round.length}
                        history={history}
                        settings={settings}
                        title={t('japanese.kanaDrill.resultTitle')}
                        playAgainLabel={t('japanese.kanaDrill.retry')}
                        settingsLabel={t('japanese.kanaDrill.result.settingsButton')}
                        exitLabel={t('japanese.kanaDrill.result.exitButton')}
                        onRetry={startQuiz}
                        onSettings={goToSettings}
                        onExit={() => {}}
                    />
                )}
            </div>
        </section>
    );
}
