// -Path: 'client/app/pages/japanese/review/DeckList.tsx'
import { Languages } from '~/data/language';
import DeckListPage from '~/components/page/DeckListPage';

export default function ReviewDeckList() {
    return <DeckListPage type='review' language={Languages.ja} />;
}
