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
            glyph: 'あ',
            description: t('languageSelect.languages.japanese.description'),
            available: true,
            to: '/japanese',
        },
        {
            id: 'english',
            code: 'en',
            name: t('languageSelect.languages.english.name'),
            glyph: 'A',
            description: t('languageSelect.languages.english.description'),
            available: false,
        },
        {
            id: 'thai',
            code: 'th',
            name: t('languageSelect.languages.thai.name'),
            glyph: 'ก',
            description: t('languageSelect.languages.thai.description'),
            available: false,
        },
        {
            id: 'korean',
            code: 'ko',
            name: t('languageSelect.languages.korean.name'),
            glyph: '한',
            description: t('languageSelect.languages.korean.description'),
            available: false,
        },
    ];

    return (
        <section className='relative min-h-screen flex items-start justify-center overflow-hidden py-16 sm:py-20'>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
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
