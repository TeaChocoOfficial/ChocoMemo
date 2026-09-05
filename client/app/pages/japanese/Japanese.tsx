// -Path: 'client/app/pages/japanese/Japanese.tsx'
import { Link } from '~/i18n/routing';
import JapaneseHero from './JapaneseHero';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import JapaneseNavCard, { type JapaneseNavItem } from './JapaneseNavCard';

export default function JapanesePage() {
    const { t } = useTranslation();

    const navItems: JapaneseNavItem[] = [
        {
            to: '/japanese/kana',
            title: t('japanese.nav.kana.title'),
            description: t('japanese.nav.kana.description'),
            action: t('japanese.nav.kana.action'),
            icon: <span className='text-2xl leading-none'>あ</span>,
        },
        {
            to: '/japanese/kana-drill',
            title: t('japanese.nav.kanaDrill.title'),
            description: t('japanese.nav.kanaDrill.description'),
            action: t('japanese.nav.kanaDrill.action'),
            icon: <span className='text-2xl leading-none font-black'>?あ</span>,
        },
        {
            to: '/japanese/vocabulary',
            title: t('japanese.nav.vocabulary.title'),
            description: t('japanese.nav.vocabulary.description'),
            action: t('japanese.nav.vocabulary.action'),
            icon: <span className='text-2xl leading-none'>語</span>,
        },
        {
            to: '/japanese/vocabulary-review',
            title: t('japanese.nav.vocabularyReview.title'),
            description: t('japanese.nav.vocabularyReview.description'),
            action: t('japanese.nav.vocabularyReview.action'),
            icon: <span className='text-2xl leading-none'>🔄</span>,
        },
    ];

    return (
        <section className='relative min-h-screen flex items-start justify-center overflow-hidden py-16 sm:py-20'>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/language-select'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.back_language')}
                </Link>

                <JapaneseHero />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {navItems.map((item, index) => (
                        <JapaneseNavCard key={item.to} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
