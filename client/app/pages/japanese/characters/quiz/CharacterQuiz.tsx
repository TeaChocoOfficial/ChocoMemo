// -Path: 'client/app/pages/japanese/characters/quiz/CharacterQuiz.tsx'
// Entry point for the character quiz. Owns the high-level phase orchestration
// by delegating game state to useCharacterQuiz and rendering decomposed
// presentational components for each phase.
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { useQuizSettingsStore } from '~/stores/quizSettings.store';
import { useSpeak } from '~/hooks/useSpeak';
import { useCharacterQuiz } from './hooks/useCharacterQuiz';
import QuizIntro from './components/QuizIntro';
import QuizPlaying from './components/QuizPlaying';
import CharacterQuizResult from './components/CharacterQuizResult';

export default function CharacterQuizPage() {
    const { t } = useTranslation();
    const settings = useQuizSettingsStore((s) => s.settings);
    const setSettings = useQuizSettingsStore((s) => s.setSettings);
    const speak = useSpeak();

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
        startQuiz,
        goToSettings,
        advance,
        endGame,
        handleSelect,
    } = useCharacterQuiz(settings);

    const isListen = settings.mode === 'listenToChar';

    const prompt = question
        ? settings.mode === 'charToRomaji'
            ? question.char
            : settings.mode === 'romajiToChar'
              ? question.romaji
              : ''
        : '';

    const promptLabel = isListen
        ? t('japanese.characterQuiz.promptLabelListen')
        : settings.mode === 'charToRomaji'
          ? t('japanese.characterQuiz.promptLabel')
          : t('japanese.characterQuiz.promptLabelRomajiToChar');

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
                            to='/japanese/characters'
                            className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                        >
                            <FaArrowLeft className='w-3.5 h-3.5' />
                            {t('japanese.characterQuiz.back_characters')}
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
                        disabled={!!lastChoice}
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
                    <CharacterQuizResult
                        score={score}
                        wrongCount={wrongCount}
                        timeoutCount={timeoutCount}
                        total={round.length}
                        history={history}
                        settings={settings}
                        title={t('japanese.characterQuiz.resultTitle')}
                        playAgainLabel={t('japanese.characterQuiz.retry')}
                        settingsLabel={t('japanese.characterQuiz.result.settingsButton')}
                        exitLabel={t('japanese.characterQuiz.result.exitButton')}
                        onRetry={startQuiz}
                        onSettings={goToSettings}
                        onExit={() => {}}
                    />
                )}
            </div>
        </section>
    );
}
