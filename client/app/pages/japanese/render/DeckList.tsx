// -Path: 'client/app/pages/japanese/render/DeckList.tsx'
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import DecksList from '~/components/container/DecksList';
import { allRenderDecks } from '~/stores/render.store';
import { useLangText } from '~/hooks/useLangText';
import RenderDeckCard from './components/RenderDeckCard';

export default function RenderDeckList() {
    const { t } = useTranslation();
    const locale = useLangText();
    const decks = allRenderDecks();

    return (
        <Section>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.render.back_hub')}
                </Link>

                <DecksList<{ id: string }>
                    localItems={decks}
                    eyebrow={t('japanese.render.eyebrow')}
                    title={t('japanese.render.title')}
                    description={t('japanese.render.description')}
                    searchPlaceholder={t('japanese.render.search')}
                    cloudItems={null}
                    communityItems={null}
                    getSearchText={(deck) => {
                        const d = deck as (typeof decks)[number];
                        return `${locale(d.name)} ${d.description ? locale(d.description) : ''}`;
                    }}
                    emptyStateLabel={t('japanese.render.empty')}
                    renderItem={(item, index) => (
                        <RenderDeckCard deck={item as (typeof decks)[number]} index={index} />
                    )}
                />
            </div>
        </Section>
    );
}
