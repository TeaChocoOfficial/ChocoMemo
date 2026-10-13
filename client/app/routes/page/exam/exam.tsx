// -Path: 'client/app/routes/page/exam/exam.tsx'
import type { Route } from './+types/exam';
import DeckListPage from '~/components/page/DeckListPage';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Exam' },
        { name: 'description', content: 'Browse and pick a multiple-choice exam.' },
    ];
}

export default function Exam() {
    return <DeckListPage type='exam' />;
}
