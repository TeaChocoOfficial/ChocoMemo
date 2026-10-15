// -Path: 'client/app/routes/page/exam/exam.$deckId.tsx'
import type { Route } from './+types/exam.$deckId';
import ComingSoonPage from '~/components/page/ComingSoonPage';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'ChocoMemo - Exam' }, { name: 'description', content: 'Run this exam deck.' }];
}

export default function ExamById() {
    return <ComingSoonPage />;
}
