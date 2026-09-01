// -Path: 'client/app/pages/japanese/Japanese.tsx'
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import JapaneseHero from './JapaneseHero';
import JapaneseNavCard, { type JapaneseNavItem } from './JapaneseNavCard';
import AmbientBackdrop from '~/components/screen/AmbientBackdrop';

export default function JapanesePage() {
    const { t } = useTranslation();

    const navItems: JapaneseNavItem[] = [
        {
            to: '/japanese/characters',
            title: t('japanese.nav.characters.title'),
            description: t('japanese.nav.characters.description'),
            action: t('japanese.nav.characters.action'),
            icon: <span className='text-2xl leading-none'>あ</span>,
        },
        {
            to: '/japanese/characters/quiz',
            title: t('japanese.nav.characterQuiz.title'),
            description: t('japanese.nav.characterQuiz.description'),
            action: t('japanese.nav.characterQuiz.action'),
            icon: <span className='text-2xl leading-none font-black'>?あ</span>,
        },
        {
            to: '/japanese/vocabulary/quiz',
            title: t('japanese.nav.vocabularyQuiz.title'),
            description: t('japanese.nav.vocabularyQuiz.description'),
            action: t('japanese.nav.vocabularyQuiz.action'),
            icon: <span className='text-2xl leading-none'>語</span>,
        },
    ];

    return (
        <section className='relative min-h-screen flex items-start justify-center overflow-hidden py-16 sm:py-20'>
            <AmbientBackdrop kanji='日' />

            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/language-select'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.back_language')}
                </Link>

                <JapaneseHero />

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {navItems.map((item, index) => (
                        <JapaneseNavCard key={item.to} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
