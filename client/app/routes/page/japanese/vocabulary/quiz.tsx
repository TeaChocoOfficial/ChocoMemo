// -Path: 'client/app/routes/page/japanese/vocabulary/quiz.tsx'
import VocabularyQuizPage from '~/pages/japanese/vocabulary/quiz/VocabularyQuiz';
import type { Route } from './+types/quiz';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Learn Choco - Vocabulary Quiz' },
        { name: 'description', content: 'Test your Japanese vocabulary knowledge.' },
    ];
}

export default function VocabularyQuiz() {
    return <VocabularyQuizPage />;
}
