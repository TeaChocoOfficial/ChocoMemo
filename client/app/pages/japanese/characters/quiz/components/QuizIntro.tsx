// -Path: 'client/app/pages/japanese/characters/quiz/components/QuizIntro.tsx'
// Intro screen for the character quiz: badge, title, description, settings
// panel, and the Start button.
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Badge from '~/components/custom/Badge';
import QuizSettings, { type QuizSettingsState } from './QuizSettings';

interface QuizIntroProps {
    settings: QuizSettingsState;
    onChange: (settings: QuizSettingsState) => void;
    onStart: () => void;
}

export default function QuizIntro({ settings, onChange, onStart }: QuizIntroProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center'
        >
            <Badge variant='info' className='mb-6'>
                {t('japanese.characterQuiz.badge')}
            </Badge>
            <h1 className='text-4xl sm:text-5xl font-black tracking-tighter text-surface-foreground mb-4'>
                {t('japanese.characterQuiz.title')}
            </h1>
            <p className='max-w-xl mx-auto text-lg text-surface-subtle leading-relaxed mb-10'>
                {t('japanese.characterQuiz.intro')}
            </p>

            <QuizSettings settings={settings} onChange={onChange} />

            <button
                type='button'
                onClick={onStart}
                className='mt-8 px-8 py-3.5 rounded-sm bg-accent text-accent-foreground text-base font-semibold transition-colors duration-200 cursor-pointer hover:bg-accent-emphasis active:translate-y-px'
            >
                {t('japanese.characterQuiz.start')}
            </button>
        </motion.div>
    );
}