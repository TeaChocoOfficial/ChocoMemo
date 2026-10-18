// -Path: 'client/app/pages/home/HomeLanguages.tsx'
import { useTranslation } from 'react-i18next';
import HomeSection from './HomeSection';
import LanguageCard from './LanguageCard';
import { languages } from '~/data/language';

/**
 * The language section: every target language as an actionable row. Picking a
 * language sets it and continues to its deck list.
 */
export default function HomeLanguages() {
    const { t } = useTranslation();

    return (
        <HomeSection
            index='02'
            id='languages'
            badge={t('home.languages.badge')}
            title={t('home.languages.title')}
            hint={t('home.languages.hint')}
        >
            <div className='space-y-3'>
                {languages.map((language, index) => (
                    <LanguageCard key={language.id} language={language} index={index} />
                ))}
            </div>
        </HomeSection>
    );
}
