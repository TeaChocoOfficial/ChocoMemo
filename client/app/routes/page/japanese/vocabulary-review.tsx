// -Path: 'client/app/routes/page/japanese/vocabulary-review.tsx'
import type { Route } from './+types/vocabulary-review';
import DexListPage from '~/pages/japanese/vocabulary-review/DexList';

export function meta({}: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary DEX' },
        {
            name: 'description',
            content: 'Pick a vocabulary deck and review with flashcards and spaced repetition.',
        },
    ];
}

export default function VocabularyReview() {
    return <DexListPage />;
}