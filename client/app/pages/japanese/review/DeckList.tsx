// -Path: 'client/app/pages/japanese/review/DeckList.tsx'
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { allDecks } from '~/stores/deck.store';
import Section from '~/components/custom/Section';
import { useLangText } from '~/hooks/useLangText';
import ImportDeckButton from './ImportDeckButton';
import AddCustomDeckButton from './AddCustomDeckButton';
import DecksList from '~/components/container/DecksList';
import { exportDeck } from '~/utils/deck';

export default function DeckListPage() {
    const decks = allDecks();
    const locale = useLangText();
    const { t } = useTranslation();

    return (
        <Section>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to='/japanese'
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t('japanese.vocabularyReview.back_hub')}
                </Link>

                <DecksList
                    cloudItems={null}
                    localItems={decks}
                    to='/japanese/review/'
                    eyebrow='Review desk'
                    title={t('japanese.decks.title')}
                    description={t('japanese.decks.description')}
                    searchPlaceholder={t('japanese.decks.search')}
                    communityItems={null}
                    getSearchText={(deck) => {
                        const name = locale(deck.name);
                        const description = deck.description ? locale(deck.description) : '';
                        return `${name} ${description}`;
                    }}
                    emptyStateLabel={t('japanese.decks.empty')}
                    headerAction={
                        <div className='flex flex-wrap items-center gap-2'>
                            <ImportDeckButton />
                            <AddCustomDeckButton />
                        </div>
                    }
                    onExport={(deck) => exportDeck(deck)}
                    onDelete={() => {}}
                    onDownload={() => {}}
                />
            </div>
        </Section>
    );
}
