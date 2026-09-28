// -Path: 'client/app/routes/page/english/exam/exam.tsx'
import DeckListPage from '~/components/page/DeckListPage';
import { Languages } from '~/data/language';
import type { Route } from './+types/exam';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Exam' },
        { name: 'description', content: 'English exam.' },
    ];
}

export default function EnglishExams() {
    return <DeckListPage type='exam' language={Languages.en} />;
}
