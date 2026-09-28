// -Path: 'client/app/routes/page/japanese/exam/exam.tsx'
import type { Route } from './+types/exam';
import DeckListPage from '~/pages/japanese/exam/DeckList';

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
    return <DeckListPage />;
}
