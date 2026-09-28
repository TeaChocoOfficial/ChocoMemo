// -Path: 'client/app/pages/japanese/exam/ExamSetList.tsx'
import { Languages } from '~/data/language';
import DeckListPage from '~/components/page/DeckListPage';

export default function ExamDeckList() {
    return <DeckListPage type='exam' language={Languages.ja} />;
}
