// -Path: 'client/app/routes/page/japanese/exam/exam.tsx'
import type { Route } from './+types/exam';
import { Languages } from '~/data/language';
import DeckListPage from '~/components/page/DeckListPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Exam' },
        {
            name: 'description',
            content: 'Browse and pick a multiple-choice exam.',
        },
    ];
}

export default function VocabularyExams() {
    return <DeckListPage type='exam' language={Languages.ja} />;
}
