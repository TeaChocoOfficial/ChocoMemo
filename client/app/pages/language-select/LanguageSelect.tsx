// -Path: 'client/app/pages/language-select/LanguageSelect.tsx'
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import LanguageSelectHero from './LanguageSelectHero';
import LanguageCard, { LanguageLockedRow, type AvailableLanguage } from './LanguageCard';

export default function LanguageSelectPage() {
    const { t } = useTranslation();

    const languages: AvailableLanguage[] = [
        {
            id: 'english',
            code: 'en',
            name: t('languageSelect.languages.english.name'),
            glyph: 'A',
            description: t('languageSelect.languages.english.description'),
            available: false,
        },
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
            id: 'korean',
            code: 'ko',
            name: t('languageSelect.languages.korean.name'),
            glyph: '한',
            description: t('languageSelect.languages.korean.description'),
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
            id: 'chinese',
            code: 'zh',
            name: t('languageSelect.languages.chinese.name'),
            glyph: '字',
            description: t('languageSelect.languages.chinese.description'),
            available: false,
        },
    ];

    // Only one language ships today, so the page is a list: the ready ones get
    // full-width actionable rows, the rest collapse into one quiet group. A
    // grid of five equal tiles read as "mostly unavailable".
    const ready = languages.filter((language) => language.available);
    const comingSoon = languages.filter((language) => !language.available);

    return (
        <Section className='items-start justify-center'>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('languageSelect.back_home')}
                </Link>

                <LanguageSelectHero />

                <div className='space-y-3'>
                    {ready.map((language, index) => (
                        <LanguageCard key={language.id} language={language} index={index} />
                    ))}
                </div>

                {comingSoon.length > 0 && (
                    <div className='mt-8'>
                        <div className='overflow-hidden rounded-sm border border-line'>
                            <p className='border-b border-line bg-surface px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-muted sm:px-5'>
                                {t('languageSelect.status.comingSoon')}
                            </p>
                            <div className='divide-y divide-line'>
                                {comingSoon.map((language, index) => (
                                    <LanguageLockedRow
                                        key={language.id}
                                        language={language}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
}
