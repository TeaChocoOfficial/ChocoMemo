// -Path: 'client/app/pages/english/English.tsx'
import { useTranslation } from 'react-i18next';
import type { Language, Languages } from '~/data/language';
import NavRow from '~/components/container/NavRow';
import PageHero from '~/components/custom/PageHero';
import PageShell from '~/components/custom/PageShell';
import SectionHeading from '~/components/custom/SectionHeading';

interface NavType {
    id: string;
    icon: React.ReactNode;
}

/**
 * English track hub: the same shape as the Japanese hub, so a track only
 * supplies its destinations and the layout stays shared. Deck lists read from
 * the language-keyed stores, so switching tracks is a data concern.
 */
export default function MainPage({
    stats,
    learn,
    practice,
    language,
}: {
    learn: NavType[];
    practice: NavType[];
    language: Languages;
    stats?: React.ReactNode;
}) {
    const { t } = useTranslation();

    const mapNavRow = (item: NavType, index: number) => (
        <NavRow
            key={item.id}
            index={index}
            icon={item.icon}
            to={`/${language}/${item.id}`}
            title={t(`${language}.nav.${item.id}.title`)}
            action={t(`${language}.nav.${item.id}.action`)}
            description={t(`${language}.nav.${item.id}.description`)}
        />
    );
    return (
        <PageShell backLabel={t('languageSelect.back_language')} backTo='/language-select'>
            <PageHero
                badge={t(`${language}.badge`)}
                title={t(`${language}.title`)}
                description={t(`${language}.description`)}
            />

            {stats}

            <div className='mb-12'>
                <SectionHeading step='01' label={t(`${language}.sections.learn`)} />
                <div className='space-y-3'>{learn.map(mapNavRow)}</div>
            </div>

            <div>
                <SectionHeading step='02' label={t(`${language}.sections.practice`)} />
                <div className='space-y-3'>{practice.map(mapNavRow)}</div>
            </div>
        </PageShell>
    );
}
