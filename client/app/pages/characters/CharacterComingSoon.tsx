// -Path: 'client/app/pages/characters/CharacterComingSoon.tsx'
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';

/**
 * Shown when a target language has no character chart yet (or is not ready).
 * Honest about the state instead of rendering an empty grid.
 */
export default function CharacterComingSoon({ targetLang }: { targetLang?: string }) {
    const { t } = useTranslation();

    return (
        <Section>
            <div className='mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 w-full'>
                <Link
                    to='/'
                    className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition-colors hover:text-primary'
                >
                    <FaArrowLeft className='h-3.5 w-3.5' />
                    {t('characters.back_hub')}
                </Link>
                <p className='text-sm text-surface-muted'>
                    {t('characters.comingSoon', {
                        language: targetLang
                            ? t(`languageSelect.languages.${targetLang}.name`)
                            : t('characters.unknown'),
                    })}
                </p>
            </div>
        </Section>
    );
}
