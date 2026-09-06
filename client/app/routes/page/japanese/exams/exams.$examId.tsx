// -Path: 'client/app/routes/page/japanese/exams/exams.$examId.tsx'
import type { Route } from './+types/exams.$examId';
import ExamSessionPage from '~/pages/japanese/exams/exam/ExamSession';

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary Exam' },
        {
            name: 'description',
            content: `Running the "${params.examId}" vocabulary exam.`,
        },
    ];
}

export default function VocabularyExam() {
    return <ExamSessionPage />;
}