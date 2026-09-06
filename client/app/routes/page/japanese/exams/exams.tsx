// -Path: 'client/app/routes/page/japanese/exams/exams.tsx'
import type { Route } from './+types/exams';
import ExamSetListPage from '~/pages/japanese/exams/ExamSetList';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary Exams' },
        {
            name: 'description',
            content: 'Browse and pick a multiple-choice vocabulary exam.',
        },
    ];
}

export default function VocabularyExams() {
    return <ExamSetListPage />;
}