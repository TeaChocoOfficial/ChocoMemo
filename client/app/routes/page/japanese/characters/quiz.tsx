// -Path: 'client/app/routes/page/japanese/characters/quiz.tsx'
import CharacterQuizPage from '~/pages/japanese/quiz/CharacterQuiz';
import type { Route } from './+types/quiz';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Character Quiz' },
        { name: 'description', content: 'Test your Hiragana and Katakana recognition.' },
    ];
}

export default function CharacterQuiz() {
    return <CharacterQuizPage />;
}
