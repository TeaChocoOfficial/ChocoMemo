// -Path: 'client/app/pages/japanese/review/DeckList.tsx'
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { Link } from '~/i18n/routing';
import Section from '~/components/custom/Section';
import CollectionListPage from '~/components/container/CollectionListPage';
import { useLangText } from '~/hooks/useLangText';
import { allDecks } from '~/stores/deck.store';
import DeckCard from './components/DeckCard';

export default function DeckListPage() {
    const { t } = useTranslation();
    const locale = useLangText();
    const decks = allDecks();

    return (
        <Section>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-accent transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.vocabularyReview.back_hub')}
                </Link>

                <CollectionListPage
                    eyebrow='Review desk'
                    title={t('japanese.decks.title')}
                    description={t('japanese.decks.description')}
                    searchPlaceholder='Search decks...'
                    localItems={decks}
                    cloudItems={null}
                    communityItems={null}
                    getSearchText={(deck) => {
                        const name = locale(deck.name);
                        const description = deck.description ? locale(deck.description) : '';
                        return `${name} ${description}`;
                    }}
                    emptyStateLabel={t('japanese.decks.notFound')}
                    renderItem={(deck) => <DeckCard deck={deck} />}
                />
            </div>
        </Section>
    );
}