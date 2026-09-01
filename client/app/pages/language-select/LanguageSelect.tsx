// -Path: 'client/app/pages/language-select/LanguageSelect.tsx'
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import LanguageCard, { type AvailableLanguage } from './LanguageCard';
import LanguageSelectHero from './LanguageSelectHero';
import { FaArrowLeft } from 'react-icons/fa6';

export default function LanguageSelectPage() {
    const { t } = useTranslation();

    const languages: AvailableLanguage[] = [
        {
            id: 'japanese',
            code: 'ja',
            name: t('languageSelect.languages.japanese.name'),
            flag: '🇯🇵',
            description: t('languageSelect.languages.japanese.description'),
            available: true,
            to: '/japanese',
        },
        {
            id: 'english',
            code: 'en',
            name: t('languageSelect.languages.english.name'),
            flag: '🇬🇧',
            description: t('languageSelect.languages.english.description'),
            available: false,
        },
    ];

    return (
        <section className='relative min-h-screen flex items-start justify-center overflow-hidden py-16 sm:py-20'>
            <div className='absolute inset-0 -z-10'>
                <div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2' />
                <div className='absolute bottom-0 left-0 w-80 h-80 bg-secondary/8 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3' />
            </div>

            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('languageSelect.back_home')}
                </Link>

                <LanguageSelectHero />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {languages.map((language, index) => (
                        <motion.div key={language.id}>
                            <LanguageCard language={language} index={index} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
