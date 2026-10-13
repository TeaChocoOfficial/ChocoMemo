// -Path: 'client/app/pages/home/HomeLanguages.tsx'
import { useTranslation } from 'react-i18next';
import HomeSection from './HomeSection';
import LanguageCard, { LanguageLockedRow } from './LanguageCard';
import { languages } from '~/data/language';

/**
 * The language section: every target language, ready ones as actionable rows
 * and the unbuilt ones grouped under a quiet "Coming Soon" heading. Picking a
 * ready language sets it and continues to its deck list.
 */
export default function HomeLanguages() {
    const { t } = useTranslation();

    const ready = languages.filter((language) => language.status === 'ready');
    const comingSoon = languages.filter((language) => language.status !== 'ready');

    return (
        <HomeSection
            index='02'
            id='languages'
            badge={t('home.languages.badge')}
            title={t('home.languages.title')}
            hint={t('home.languages.hint')}
        >
            <div className='space-y-3'>
                {ready.map((language, index) => (
                    <LanguageCard key={language.id} language={language} index={index} />
                ))}
            </div>

            {comingSoon.length > 0 && (
                <div className='mt-8 overflow-hidden rounded-sm border border-line'>
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
            )}
        </HomeSection>
    );
}
