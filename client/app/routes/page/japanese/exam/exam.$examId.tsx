// -Path: 'client/app/routes/page/japanese/exam/exam.$examId.tsx'
import type { Route } from './+types/exam.$examId';

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Exam' },
        {
            name: 'description',
            content: `Running the "${params.examId}" exam.`,
        },
    ];
}

export default function JapaneseExamById() {
    return <></>;
}
