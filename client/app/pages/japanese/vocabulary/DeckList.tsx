// -Path: 'client/app/pages/japanese/vocabulary/DeckList.tsx'
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import Section from '~/components/custom/Section';
import DecksList from '~/components/container/DecksList';
import { allDecks } from '~/stores/deck.store';
import { useLangText } from '~/hooks/useLangText';
import VocabularyDeckCard from './components/VocabularyDeckCard';

export default function VocabularyDeckList() {
    const { t } = useTranslation();
    const locale = useLangText();
    const decks = allDecks();

    return (
        <Section>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.vocabulary.back_hub')}
                </Link>

                <DecksList<{ id: string }>
                    localItems={decks}
                    eyebrow={t('japanese.vocabulary.eyebrow')}
                    title={t('japanese.vocabulary.title')}
                    description={t('japanese.vocabulary.description')}
                    searchPlaceholder={t('japanese.vocabulary.search')}
                    cloudItems={null}
                    communityItems={null}
                    getSearchText={(deck) => {
                        const d = deck as (typeof decks)[number];
                        const name = locale(d.name);
                        return `${name} ${d.description ? locale(d.description) : ''}`;
                    }}
                    emptyStateLabel={t('japanese.vocabulary.empty')}
                    renderItem={(item, index) => (
                        <VocabularyDeckCard
                            deck={item as (typeof decks)[number]}
                            index={index}
                        />
                    )}
                />
            </div>
        </Section>
    );
}
