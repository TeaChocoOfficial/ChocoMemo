// -Path: 'client/app/routes/page/japanese/vocabulary/practice.tsx'
import PracticeSession from '~/pages/japanese/vocabulary/practice/PracticeSession';
import type { Route } from './+types/practice';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary Practice' },
        { name: 'description', content: 'Practice Japanese vocabulary with flashcards and spaced repetition.' },
    ];
}

export default function Practice() {
    return <PracticeSession />;
}
