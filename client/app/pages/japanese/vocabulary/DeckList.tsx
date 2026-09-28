// -Path: 'client/app/pages/japanese/vocabulary/DeckList.tsx'
import { Languages } from '~/data/language';
import DeckListPage from '~/components/page/DeckListPage';

export default function VocabularyDeckList() {
    return <DeckListPage type='vocab' language={Languages.ja} />;
}
