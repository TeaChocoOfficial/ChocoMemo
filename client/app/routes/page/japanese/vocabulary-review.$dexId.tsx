// -Path: 'client/app/routes/page/japanese/vocabulary-review.$dexId.tsx'
import type { Route } from './+types/vocabulary-review.$dexId';
import VocabularyReviewPage from '~/pages/japanese/vocabulary-review/VocabularyReview';

export function meta({ params }: Route.MetaArgs) {
    return [
        { title: 'ChocoMemo - Vocabulary Review' },
        {
            name: 'description',
            content: `Review the "${params.dexId}" vocabulary deck with flashcards and spaced repetition.`,
        },
    ];
}

export default function VocabularyReviewDeck() {
    return <VocabularyReviewPage />;
}